import prisma from '../config/prisma.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

export const getAllProperties = async (req, res) => {
  try {
    const {
      featured,
      limit = 50,
      page = 1,
      search,
      type,
      priceMin,
      priceMax,
      bedrooms,
      location,
      status,
      sort = 'newest',
    } = req.query;

    // Build the where clause for Prisma
    const where = {};

    if (featured === 'true') where.featured = true;
    if (type) where.type = { equals: type, mode: 'insensitive' };
    if (status) where.status = { equals: status, mode: 'insensitive' };
    if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) };
    if (location) where.location = { contains: location, mode: 'insensitive' };

    // Handle price range
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = parseFloat(priceMin);
      if (priceMax) where.price.lte = parseFloat(priceMax);
    }

    // Handle search across multiple fields
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Handle sorting
    const orderBy = {};
    switch (sort) {
      case 'price-low':
        orderBy.price = 'asc';
        break;
      case 'price-high':
        orderBy.price = 'desc';
        break;
      case 'area':
        orderBy.area = 'desc';
        break;
      case 'newest':
      default:
        orderBy.createdAt = 'desc';
        break;
    }

    const skip = (page - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Get paginated results and total count
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.property.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties',
      error: error.message,
    });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch property',
      error: error.message,
    });
  }
};

export const createProperty = async (req, res) => {
  try {
    const { userId, ...propertyData } = req.body;

    const newProperty = await prisma.property.create({
      data: {
        ...propertyData,
        user: {
          connect: { id: userId },
        },
      },
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: newProperty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create property',
      error: error.message,
    });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, ...propertyData } = req.body;

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        ...propertyData,
        user: {
          connect: { id: userId },
        },
      },
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update property',
      error: error.message,
    });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const existingProperty = await prisma.property.findUnique({
      where: { id },
    });

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    if (existingProperty.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property',
      });
    }

    await prisma.property.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete property',
      error: error.message,
    });
  }
};

export const uploadPropertyImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!req.files || !req.files.images) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded or invalid file field name',
        receivedFiles: req.files ? Object.keys(req.files) : 'No files',
      });
    }

    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    // Check property ownership
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check if either the user owns the property or is an admin
    const isOwner = existingProperty.userId === userId;
    const isAdmin = req.user?.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized' });
    }

    // Upload to Cloudinary
    const uploadedImages = [];
    for (let file of files) {
      const { url, publicId } = await uploadToCloudinary(file, 'properties');
      const image = await prisma.image.create({
        data: {
          url,
          publicId,
          propertyId: id,
        },
      });
      uploadedImages.push(image);
    }

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: uploadedImages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message,
    });
  }
};

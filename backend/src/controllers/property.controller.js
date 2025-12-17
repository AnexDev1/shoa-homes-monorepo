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
    if (type && type !== '') where.type = { equals: type };
    if (status && status !== '') where.status = { equals: status };
    if (bedrooms && bedrooms !== '')
      where.bedrooms = { gte: parseInt(bedrooms) };
    if (location && location !== '') where.location = { contains: location };

    // Handle price range
    if ((priceMin && priceMin !== '') || (priceMax && priceMax !== '')) {
      where.price = {};
      if (priceMin && priceMin !== '') where.price.gte = parseFloat(priceMin);
      if (priceMax && priceMax !== '') where.price.lte = parseFloat(priceMax);
    }

    // Handle search across multiple fields
    if (search && search !== '') {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ];
    }

    // Handle sorting
    const orderBy = {};
    switch (sort) {
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
      prisma.property.count({
        where: {
          featured: where.featured,
          type: where.type ? where.type.equals : undefined,
          status: where.status ? where.status.equals : undefined,
          bedrooms: where.bedrooms,
          location: where.location
            ? { contains: where.location.contains }
            : undefined,
          price: where.price,
          OR: where.OR,
        },
      }),
    ]);

    // Parse amenities before returning to clients so they get arrays
    const parsedProperties = properties.map((p) => ({
      ...p,
      amenities:
        typeof p.amenities === 'string'
          ? JSON.parse(p.amenities)
          : p.amenities || [],
    }));

    res.status(200).json({
      success: true,
      data: parsedProperties,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
      total,
    });
  } catch (error) {
    console.error('Error in getAllProperties:', error?.stack || error);
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

    const parsedProperty = {
      ...property,
      amenities:
        typeof property.amenities === 'string'
          ? JSON.parse(property.amenities)
          : property.amenities || [],
    };
    res.status(200).json({
      success: true,
      data: parsedProperty,
    });
  } catch (error) {
    console.error('Error in getPropertyById:', error?.stack || error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch property',
      error: error.message,
    });
  }
};

export const createProperty = async (req, res) => {
  try {
    // Prefer authenticated user ID; fall back to body if provided
    const userId = req.user?.id || req.body?.userId;
    const propertyData = { ...req.body };

    // Validate status if provided (default to 'For Sale' if not provided)
    if (propertyData.status && !VALID_STATUSES.includes(propertyData.status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }
    propertyData.status = propertyData.status || 'For Sale';

    // Normalize amenities: store as JSON string in DB
    if (Array.isArray(propertyData.amenities)) {
      propertyData.amenities = JSON.stringify(propertyData.amenities);
    } else if (typeof propertyData.amenities === 'string') {
      // If it's already a comma-separated string -> convert to JSON
      try {
        // If already JSON string, keep it
        JSON.parse(propertyData.amenities);
      } catch (e) {
        propertyData.amenities = JSON.stringify(
          propertyData.amenities
            .split(',')
            .map((a) => a.trim())
            .filter(Boolean)
        );
      }
    }

    // Normalize numeric fields and lat/lng
    const parseNullableFloat = (value) => {
      if (value === undefined || value === null || value === '') return null;
      const parsed = parseFloat(value);
      return Number.isNaN(parsed) ? null : parsed;
    };

    propertyData.latitude = parseNullableFloat(propertyData.latitude);
    propertyData.longitude = parseNullableFloat(propertyData.longitude);
    propertyData.price = parseNullableFloat(propertyData.price);
    propertyData.area = parseNullableFloat(propertyData.area);

    const parseNullableInt = (value) => {
      if (value === undefined || value === null || value === '') return null;
      const parsed = parseInt(value);
      return Number.isNaN(parsed) ? null : parsed;
    };

    propertyData.bedrooms = parseNullableInt(propertyData.bedrooms);
    propertyData.bathrooms = parseNullableInt(propertyData.bathrooms);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    // Don't pass userId scalar directly; use relation connect
    delete propertyData.userId;

    // Only include fields that exist in the Prisma Property model to avoid validation errors
    const allowedFields = [
      'title',
      'description',
      'type',
      'status',
      'location',
      'latitude',
      'longitude',
      'bedrooms',
      'bathrooms',
      'area',
      'amenities',
      'featured',
    ];
    const dataToCreate = {};
    for (const k of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(propertyData, k)) {
        dataToCreate[k] = propertyData[k];
      }
    }
    dataToCreate.user = { connect: { id: userId } };

    const newProperty = await prisma.property.create({
      data: dataToCreate,
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

    const parsedProperty = {
      ...newProperty,
      amenities:
        typeof newProperty.amenities === 'string'
          ? JSON.parse(newProperty.amenities)
          : newProperty.amenities || [],
    };
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: parsedProperty,
    });
  } catch (error) {
    console.error('Error in createProperty:', error?.stack || error);
    res.status(500).json({
      success: false,
      message: 'Failed to create property',
      error: error.message,
    });
  }
};

// Valid property status values
const VALID_STATUSES = ['For Sale', 'Sold'];

export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    // Prefer authenticated user ID; fall back to body if provided
    const userId = req.user?.id || req.body?.userId;
    const propertyData = { ...req.body };

    // Validate status if provided
    if (propertyData.status && !VALID_STATUSES.includes(propertyData.status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    // Get the existing property first
    const existingProperty = await prisma.property.findUnique({
      where: { id },
    });

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Normalize amenities: store as JSON string in DB
    if (propertyData.amenities) {
      if (Array.isArray(propertyData.amenities)) {
        propertyData.amenities = JSON.stringify(propertyData.amenities);
      } else if (typeof propertyData.amenities === 'string') {
        try {
          // Check if it's already a JSON string
          JSON.parse(propertyData.amenities);
        } catch (e) {
          // If not, convert from comma-separated string to JSON array string
          propertyData.amenities = JSON.stringify(
            propertyData.amenities
              .split(',')
              .map((a) => a.trim())
              .filter(Boolean)
          );
        }
      }
    } else {
      // If amenities is not provided, keep the existing value
      delete propertyData.amenities;
    }

    // Normalize numeric fields and lat/lng (same helper functions)
    const parseNullableFloat = (value) => {
      if (value === undefined || value === null || value === '') return null;
      const parsed = parseFloat(value);
      return Number.isNaN(parsed) ? null : parsed;
    };
    propertyData.latitude = parseNullableFloat(propertyData.latitude);
    propertyData.longitude = parseNullableFloat(propertyData.longitude);
    propertyData.price = parseNullableFloat(propertyData.price);
    propertyData.area = parseNullableFloat(propertyData.area);

    const parseNullableInt = (value) => {
      if (value === undefined || value === null || value === '') return null;
      const parsed = parseInt(value);
      return Number.isNaN(parsed) ? null : parsed;
    };
    propertyData.bedrooms = parseNullableInt(propertyData.bedrooms);
    propertyData.bathrooms = parseNullableInt(propertyData.bathrooms);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    console.log('Updating property for user:', userId);
    console.log('Incoming property update payload:', propertyData);

    // Prepare the update data
    const updateData = {
      title: propertyData.title || existingProperty.title,
      description: propertyData.description || existingProperty.description,
      type: propertyData.type || existingProperty.type,
      status: propertyData.status || existingProperty.status,
      location: propertyData.location || existingProperty.location,
      latitude:
        propertyData.latitude !== undefined
          ? propertyData.latitude
          : existingProperty.latitude,
      longitude:
        propertyData.longitude !== undefined
          ? propertyData.longitude
          : existingProperty.longitude,
      bedrooms:
        propertyData.bedrooms !== undefined
          ? propertyData.bedrooms
          : existingProperty.bedrooms,
      bathrooms:
        propertyData.bathrooms !== undefined
          ? propertyData.bathrooms
          : existingProperty.bathrooms,
      area:
        propertyData.area !== undefined
          ? propertyData.area
          : existingProperty.area,
      amenities: propertyData.amenities || existingProperty.amenities,
      featured:
        propertyData.featured !== undefined
          ? propertyData.featured
          : existingProperty.featured,
      user: {
        connect: { id: userId },
      },
    };

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: updateData,
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

    const parsedProperty = {
      ...updatedProperty,
      amenities:
        typeof updatedProperty.amenities === 'string'
          ? JSON.parse(updatedProperty.amenities)
          : updatedProperty.amenities || [],
    };
    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: parsedProperty,
    });
  } catch (error) {
    console.error('Error in updateProperty:', error?.stack || error);
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
    const userId = req.user?.id || req.body?.userId;

    const existingProperty = await prisma.property.findUnique({
      where: { id },
    });

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Allow deletion if the user is the owner or if they are an admin
    const isOwner = existingProperty.userId === userId;
    const isAdmin = req.user?.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property',
      });
    }

    await prisma.property.delete({
      where: { id },
    });
    console.log(`Property ${id} deleted by user ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
      deletedBy: userId,
    });
  } catch (error) {
    console.error('Error in deleteProperty:', error?.stack || error);
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
    const userId = req.user?.id || req.body?.userId;

    // Debug: log incoming request content type and file fields
    console.log(
      'UploadPropertyImages: content-type:',
      req.headers['content-type']
    );
    console.log('UploadPropertyImages: req.files present?', !!req.files);
    if (req.files)
      console.log('UploadPropertyImages: files keys:', Object.keys(req.files));

    // Accept 'images' or 'images[]' field names to be more forgiving to different clients
    const fileField = req.files?.images
      ? 'images'
      : req.files?.['images[]']
        ? 'images[]'
        : null;
    if (!req.files || !fileField) {
      // Provide debug details to help diagnose upload issues during dev
      const received = req.files ? Object.keys(req.files) : 'No files';
      console.warn(
        'UploadPropertyImages: missing files or invalid field. received:',
        received
      );
      return res.status(400).json({
        success: false,
        message: 'No files uploaded or invalid file field name',
        receivedFiles: received,
        contentType: req.headers['content-type'],
      });
    }

    const files = Array.isArray(req.files[fileField])
      ? req.files[fileField]
      : [req.files[fileField]];

    // Log each file name/size for debugging
    for (let f of files) {
      console.log('Upload file:', f.name, f.size, f.mimetype);
    }

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

    // Upload to Cloudinary - continue on per-file errors and return details
    const uploadedImages = [];
    const uploadErrors = [];
    for (let file of files) {
      try {
        const { url, publicId } = await uploadToCloudinary(file, 'properties');
        console.log(`Upload success for ${file.name}: ${url}`);
        const image = await prisma.image.create({
          data: {
            url,
            publicId,
            propertyId: id,
          },
        });
        uploadedImages.push(image);
      } catch (fileErr) {
        console.error(
          'Failed to upload a file to Cloudinary:',
          file?.name,
          fileErr?.message || fileErr
        );
        uploadErrors.push({
          file: file?.name || 'unknown',
          error: fileErr?.message || String(fileErr),
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Images processed',
      data: uploadedImages,
      errors: uploadErrors,
    });
  } catch (error) {
    console.error('Error in uploadPropertyImages:', error?.stack || error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message,
    });
  }
};

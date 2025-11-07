// Mock property data
let properties = [
  {
    id: '1',
    title: 'Luxury Villa in Bole',
    description: 'Beautiful modern villa with stunning views and premium amenities.',
    price: 15000000,
    priceType: 'total',
    type: 'villa',
    status: 'for-sale',
    location: 'Bole, Addis Ababa',
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
    amenities: ['Pool', 'Garden', 'Parking', 'Security', 'Gym'],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Modern Apartment in Kirkos',
    description: 'Contemporary apartment in prime location.',
    price: 35000,
    priceType: 'per-month',
    type: 'apartment',
    status: 'for-rent',
    location: 'Kirkos, Addis Ababa',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    amenities: ['Parking', 'Balcony', 'Modern Kitchen'],
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

export const getAllProperties = async (req, res) => {
  try {
    const { featured, limit = 50, page = 1 } = req.query;
    
    let filtered = [...properties];
    
    if (featured === 'true') {
      filtered = filtered.filter(p => p.featured);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedData = filtered.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
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
    const property = properties.find(p => p.id === id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    res.json({
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
    const newProperty = {
      id: Date.now().toString(),
      ...req.body,
      images: [],
      createdAt: new Date().toISOString(),
    };

    properties.push(newProperty);

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
    const index = properties.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    properties[index] = {
      ...properties[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: properties[index],
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
    const index = properties.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    properties.splice(index, 1);

    res.json({
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

    // Mock implementation
    res.json({
      success: true,
      message: 'Images uploaded successfully (mock)',
      data: {
        images: ['https://images.unsplash.com/photo-example'],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message,
    });
  }
};

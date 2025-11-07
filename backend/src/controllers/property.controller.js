// Mock property data
let properties = [
  {
    id: '1',
    title: 'Luxury Villa with Pool & Garden',
    description: 'Experience unparalleled luxury in this stunning 5-bedroom villa featuring a private pool, landscaped garden, and modern amenities. Located in the prestigious Bole area, this property offers the perfect blend of elegance and comfort.',
    price: 45000000,
    priceType: 'total',
    type: 'Villa',
    status: 'For Sale',
    location: 'Bole, Addis Ababa',
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&q=80',
    ],
    amenities: [
      'Private Pool',
      'Garden',
      'Garage',
      'Security',
      'Gym',
      'Smart Home',
      'Central AC',
      'Generator',
    ],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Modern Penthouse with City View',
    description: 'Stunning penthouse apartment with panoramic views of Addis Ababa. Features floor-to-ceiling windows, Italian marble flooring, and a spacious balcony perfect for entertaining.',
    price: 28000000,
    priceType: 'total',
    type: 'Apartment',
    status: 'For Sale',
    location: 'Kazanchis, Addis Ababa',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    ],
    amenities: [
      'City View',
      'Balcony',
      'Modern Kitchen',
      'Parking',
      'Security',
      'Elevator',
    ],
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

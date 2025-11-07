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
  {
    id: '3',
    title: 'Cozy Studio Apartment',
    description: 'Perfect starter home in a prime location. This modern studio apartment features an open layout, modern appliances, and is close to shopping and entertainment.',
    price: 8500000,
    priceType: 'total',
    type: 'Apartment',
    status: 'For Sale',
    location: 'CMC, Addis Ababa',
    bedrooms: 1,
    bathrooms: 1,
    area: 65,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
    ],
    amenities: [
      'Modern Kitchen',
      'Parking',
      'Security',
      'Elevator',
    ],
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Spacious Family House',
    description: 'Ideal family home with 4 bedrooms, large garden, and plenty of space for children to play. Located in a quiet residential area.',
    price: 22000000,
    priceType: 'total',
    type: 'House',
    status: 'For Sale',
    location: 'Yeka, Addis Ababa',
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    ],
    amenities: [
      'Garden',
      'Garage',
      'Security',
      'Water Tank',
    ],
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Commercial Office Space',
    description: 'Prime commercial space in the heart of the business district. Perfect for offices, clinics, or retail businesses.',
    price: 150000,
    priceType: 'per-month',
    type: 'Commercial',
    status: 'For Rent',
    location: 'Arada, Addis Ababa',
    bedrooms: 0,
    bathrooms: 2,
    area: 200,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    ],
    amenities: [
      'Parking',
      'Security',
      'Elevator',
      'Meeting Rooms',
    ],
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Luxury Condo with Amenities',
    description: 'High-end condominium with access to pool, gym, and concierge services. Modern design with premium finishes throughout.',
    price: 35000000,
    priceType: 'total',
    type: 'Condo',
    status: 'For Sale',
    location: 'Bole, Addis Ababa',
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
    ],
    amenities: [
      'Pool',
      'Gym',
      'Concierge',
      'Parking',
      'Security',
    ],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Affordable Townhouse',
    description: 'Budget-friendly townhouse perfect for first-time buyers. Well-maintained with modern amenities in a developing area.',
    price: 12000000,
    priceType: 'total',
    type: 'House',
    status: 'For Sale',
    location: 'Lideta, Addis Ababa',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    ],
    amenities: [
      'Parking',
      'Security',
      'Water Tank',
    ],
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'Executive Penthouse',
    description: 'Ultra-luxury penthouse with private elevator, rooftop terrace, and breathtaking city views. The epitome of sophisticated living.',
    price: 75000000,
    priceType: 'total',
    type: 'Apartment',
    status: 'For Sale',
    location: 'Bole, Addis Ababa',
    bedrooms: 4,
    bathrooms: 4,
    area: 400,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    ],
    amenities: [
      'Private Elevator',
      'Rooftop Terrace',
      'City View',
      'Smart Home',
      'Wine Cellar',
      'Home Theater',
    ],
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

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
      sort = 'newest'
    } = req.query;

    let filtered = [...properties];

    // Featured filter
    if (featured === 'true') {
      filtered = filtered.filter(p => p.featured);
    }

    // Search filter (title, description, location)
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.location.toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (type) {
      filtered = filtered.filter(p => p.type.toLowerCase() === type.toLowerCase());
    }

    // Price range filters
    if (priceMin) {
      const minPrice = parseFloat(priceMin);
      filtered = filtered.filter(p => p.price >= minPrice);
    }
    if (priceMax) {
      const maxPrice = parseFloat(priceMax);
      filtered = filtered.filter(p => p.price <= maxPrice);
    }

    // Bedrooms filter
    if (bedrooms) {
      const minBedrooms = parseInt(bedrooms);
      filtered = filtered.filter(p => p.bedrooms >= minBedrooms);
    }

    // Location filter
    if (location) {
      filtered = filtered.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
    }

    // Status filter
    if (status) {
      filtered = filtered.filter(p => p.status.toLowerCase().replace(' ', '-') === status.toLowerCase());
    }

    // Sorting
    switch (sort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'area':
        filtered.sort((a, b) => b.area - a.area);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    const total = filtered.length;
    const startIndex = (page - 1) * parseInt(limit);
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

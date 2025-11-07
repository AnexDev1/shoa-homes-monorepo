// Mock property data for development
export const mockProperties = [
  {
    id: '1',
    title: 'Luxury Villa in Bole',
    description: 'Beautiful modern villa with stunning views and premium amenities. Features spacious living areas, modern kitchen, and landscaped garden.',
    price: 15000000,
    priceType: 'total',
    type: 'villa',
    status: 'for-sale',
    location: 'Bole, Addis Ababa',
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    ],
    amenities: ['Pool', 'Garden', 'Parking', 'Security', 'Gym'],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Modern Apartment in Kirkos',
    description: 'Contemporary apartment in prime location with excellent transport links.',
    price: 35000,
    priceType: 'per-month',
    type: 'apartment',
    status: 'for-rent',
    location: 'Kirkos, Addis Ababa',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    ],
    amenities: ['Parking', 'Balcony', 'Modern Kitchen'],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Spacious House in Yeka',
    description: 'Family home with large garden and modern interiors.',
    price: 8000000,
    priceType: 'total',
    type: 'house',
    status: 'for-sale',
    location: 'Yeka, Addis Ababa',
    bedrooms: 4,
    bathrooms: 3,
    area: 300,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    ],
    amenities: ['Garden', 'Parking', 'Fireplace'],
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

export const mockInquiries = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+251 911 123456',
    message: 'I am interested in viewing this property. Please contact me.',
    propertyId: '1',
    property: mockProperties[0],
    status: 'unread',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+251 922 654321',
    message: 'What is the availability for a viewing next week?',
    propertyId: '2',
    property: mockProperties[1],
    status: 'read',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const mockDashboardStats = {
  totalProperties: 147,
  activeListings: 89,
  totalInquiries: 234,
  totalUsers: 456,
};

export const mockUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@shoahomes.com',
  role: 'admin',
  phone: '+251 911 000000',
};

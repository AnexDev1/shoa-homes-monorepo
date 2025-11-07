// Mock data for Shoa Homes Real Estate
export const mockProperties = [
  {
    id: 1,
    title: "Luxury Villa in Bole",
    price: 8500000,
    location: "Bole, Addis Ababa",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"
    ],
    description: "Stunning 4-bedroom villa with modern amenities, garden, and swimming pool. Perfect for families seeking luxury living.",
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    type: "Villa",
    status: "For Sale",
    amenities: ["Swimming Pool", "Garden", "Security System", "Garage", "Air Conditioning"],
    agent: {
      name: "Sarah Mengesha",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      phone: "+251 911 123 456",
      email: "sarah@shoahomes.com"
    },
    featured: true
  },
  {
    id: 2,
    title: "Modern Apartment in Kazanchis",
    price: 4200000,
    location: "Kazanchis, Addis Ababa",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
    ],
    description: "Contemporary 3-bedroom apartment with city views, modern kitchen, and balcony.",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    type: "Apartment",
    status: "For Sale",
    amenities: ["City View", "Modern Kitchen", "Balcony", "Elevator", "Security"],
    agent: {
      name: "David Tadesse",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      phone: "+251 922 987 654",
      email: "david@shoahomes.com"
    },
    featured: true
  },
  {
    id: 3,
    title: "Townhouse in CMC",
    price: 6500000,
    location: "CMC, Addis Ababa",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800"
    ],
    description: "Beautiful 3-story townhouse with private garden and rooftop terrace.",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    type: "Townhouse",
    status: "For Sale",
    amenities: ["Private Garden", "Rooftop Terrace", "Modern Design", "Parking"],
    agent: {
      name: "Helen Abebe",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      phone: "+251 933 456 789",
      email: "helen@shoahomes.com"
    },
    featured: false
  },
  {
    id: 4,
    title: "Condo in Piazza",
    price: 3800000,
    location: "Piazza, Addis Ababa",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800"
    ],
    description: "Spacious 2-bedroom condo in the heart of the city, close to shopping and entertainment.",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    type: "Condo",
    status: "For Sale",
    amenities: ["City Center", "Shopping Nearby", "Modern Amenities", "Security"],
    agent: {
      name: "Michael Kebede",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      phone: "+251 944 321 098",
      email: "michael@shoahomes.com"
    },
    featured: false
  },
  {
    id: 5,
    title: "Penthouse in Bole",
    price: 12000000,
    location: "Bole, Addis Ababa",
    images: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"
    ],
    description: "Exclusive penthouse with panoramic city views, luxury finishes, and private elevator.",
    bedrooms: 3,
    bathrooms: 3,
    area: 400,
    type: "Penthouse",
    status: "For Sale",
    amenities: ["Panoramic Views", "Private Elevator", "Luxury Finishes", "Rooftop Access"],
    agent: {
      name: "Anna Desta",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      phone: "+251 955 654 321",
      email: "anna@shoahomes.com"
    },
    featured: true
  }
];

export const mockAgents = [
  {
    id: 1,
    name: "Sarah Mengesha",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    phone: "+251 911 123 456",
    email: "sarah@shoahomes.com",
    listingsCount: 12
  },
  {
    id: 2,
    name: "David Tadesse",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    phone: "+251 922 987 654",
    email: "david@shoahomes.com",
    listingsCount: 8
  },
  {
    id: 3,
    name: "Helen Abebe",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    phone: "+251 933 456 789",
    email: "helen@shoahomes.com",
    listingsCount: 15
  },
  {
    id: 4,
    name: "Michael Kebede",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    phone: "+251 944 321 098",
    email: "michael@shoahomes.com",
    listingsCount: 6
  },
  {
    id: 5,
    name: "Anna Desta",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    phone: "+251 955 654 321",
    email: "anna@shoahomes.com",
    listingsCount: 10
  }
];

export const mockTestimonials = [
  {
    id: 1,
    name: "Alemayehu Bekele",
    location: "Addis Ababa",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100",
    rating: 5,
    text: "Shoa Homes helped me find my dream home in Bole. Their service was exceptional and the property exceeded my expectations. Highly recommended!",
    date: "2024-10-15"
  },
  {
    id: 2,
    name: "Tigist Haile",
    location: "Addis Ababa",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100",
    rating: 5,
    text: "Professional team with deep knowledge of the Ethiopian real estate market. They guided me through the entire process smoothly.",
    date: "2024-09-28"
  },
  {
    id: 3,
    name: "Yohannes Mekonnen",
    location: "Addis Ababa",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100",
    rating: 5,
    text: "Found the perfect investment property through Shoa Homes. Their market analysis and negotiation skills are outstanding.",
    date: "2024-09-10"
  }
];

export const mockInquiries = [
  {
    id: 1,
    propertyId: 1,
    name: "Meseret Assefa",
    email: "meseret@email.com",
    phone: "+251 966 789 012",
    message: "I'm interested in the Luxury Villa in Bole. Can we schedule a viewing?",
    date: "2024-11-01",
    status: "New"
  },
  {
    id: 2,
    propertyId: 2,
    name: "Solomon Gebremariam",
    email: "solomon@email.com",
    phone: "+251 977 345 678",
    message: "Please send more details about the Modern Apartment in Kazanchis.",
    date: "2024-10-28",
    status: "Responded"
  }
];

export const mockStats = {
  totalProperties: 45,
  totalInquiries: 23,
  activeListings: 38,
  soldThisMonth: 7
};
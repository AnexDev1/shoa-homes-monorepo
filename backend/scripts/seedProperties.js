#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const mockProperties = [
  {
    title: 'Modern 3BR Apartment in Bole',
    description:
      'Spacious 3-bedroom apartment with modern amenities, perfect for families. Features include a fully equipped kitchen, balcony with city views, and 24/7 security.',
    price: 2500000,
    priceType: 'total',
    type: 'apartment',
    status: 'for-sale',
    location: 'Bole',
    latitude: 9.0054,
    longitude: 38.7679,
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    amenities: JSON.stringify([
      'Parking',
      'Security',
      'Elevator',
      'Balcony',
      'Internet',
    ]),
    featured: true,
  },
  {
    title: 'Luxury Villa in CMC',
    description:
      'Stunning 4-bedroom villa with private garden, swimming pool, and state-of-the-art security system. Ideal for those seeking luxury living.',
    price: 8500000,
    priceType: 'total',
    type: 'villa',
    status: 'for-sale',
    location: 'CMC',
    latitude: 9.0125,
    longitude: 38.7812,
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    amenities: JSON.stringify([
      'Swimming Pool',
      'Garden',
      'Security',
      'Garage',
      'Maid Room',
    ]),
    featured: true,
  },
  {
    title: 'Cozy Studio in Kirkos',
    description:
      'Perfect starter home - modern studio apartment with all essentials. Close to shopping centers and public transport.',
    price: 800000,
    priceType: 'total',
    type: 'apartment',
    status: 'for-sale',
    location: 'Kirkos',
    latitude: 9.0087,
    longitude: 38.7645,
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    amenities: JSON.stringify(['Security', 'Elevator', 'Internet']),
    featured: false,
  },
  {
    title: 'Commercial Space in Piazza',
    description:
      'Prime commercial location with high foot traffic. Perfect for retail business or office space.',
    price: 5000000,
    priceType: 'total',
    type: 'commercial',
    status: 'for-sale',
    location: 'Piazza',
    latitude: 9.0112,
    longitude: 38.7578,
    bedrooms: 0,
    bathrooms: 2,
    area: 200,
    amenities: JSON.stringify(['Parking', 'Security', 'Elevator']),
    featured: true,
  },
  {
    title: 'Family House in Yeka',
    description:
      'Traditional Ethiopian home with modern updates. Large compound with space for expansion.',
    price: 4200000,
    priceType: 'total',
    type: 'house',
    status: 'for-sale',
    location: 'Yeka',
    latitude: 9.0156,
    longitude: 38.7943,
    bedrooms: 3,
    bathrooms: 2,
    area: 280,
    amenities: JSON.stringify(['Garden', 'Parking', 'Security', 'Water Tank']),
    featured: false,
  },
  {
    title: 'Penthouse with City Views',
    description:
      'Exclusive penthouse apartment with panoramic city views. Premium finishes and luxury amenities.',
    price: 6500000,
    priceType: 'total',
    type: 'apartment',
    status: 'for-sale',
    location: 'Bole',
    latitude: 9.0068,
    longitude: 38.7689,
    bedrooms: 3,
    bathrooms: 3,
    area: 180,
    amenities: JSON.stringify([
      'Rooftop Terrace',
      'Security',
      'Elevator',
      'Gym Access',
      'Concierge',
    ]),
    featured: true,
  },
  {
    title: 'Affordable 2BR Apartment',
    description:
      'Well-maintained 2-bedroom apartment in a quiet neighborhood. Perfect for young professionals.',
    price: 1500000,
    priceType: 'total',
    type: 'apartment',
    status: 'for-sale',
    location: 'Arada',
    latitude: 9.0345,
    longitude: 38.7456,
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    amenities: JSON.stringify(['Security', 'Parking', 'Water Heater']),
    featured: false,
  },
  {
    title: 'Spacious Office Space',
    description:
      'Modern office space with open layout, suitable for startups or small businesses.',
    price: 30000,
    priceType: 'per-month',
    type: 'commercial',
    status: 'for-rent',
    location: 'Bole',
    latitude: 9.0078,
    longitude: 38.7698,
    bedrooms: 0,
    bathrooms: 2,
    area: 150,
    amenities: JSON.stringify([
      'Parking',
      'Security',
      'Elevator',
      'Internet',
      'Meeting Room',
    ]),
    featured: false,
  },
  {
    title: 'Garden Villa in Entoto',
    description:
      'Beautiful villa surrounded by greenery, perfect for nature lovers. Includes large garden and mountain views.',
    price: 7200000,
    priceType: 'total',
    type: 'villa',
    status: 'for-sale',
    location: 'Entoto',
    latitude: 9.0876,
    longitude: 38.7654,
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    amenities: JSON.stringify([
      'Garden',
      'Mountain View',
      'Security',
      'Garage',
      'Generator',
    ]),
    featured: true,
  },
  {
    title: 'Downtown Condo',
    description:
      'Conveniently located condo in the heart of the city. Walking distance to shops and restaurants.',
    price: 2200000,
    priceType: 'total',
    type: 'apartment',
    status: 'for-sale',
    location: 'Arada',
    latitude: 9.0321,
    longitude: 38.7423,
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    amenities: JSON.stringify(['Security', 'Elevator', 'Parking', 'Internet']),
    featured: false,
  },
  {
    title: 'Investment Land in Bole',
    description:
      'Prime development land in growing area. Perfect for residential or commercial development.',
    price: 8000000,
    priceType: 'total',
    type: 'land',
    status: 'for-sale',
    location: 'Bole',
    latitude: 9.0098,
    longitude: 38.7712,
    bedrooms: 0,
    bathrooms: 0,
    area: 500,
    amenities: JSON.stringify([]),
    featured: false,
  },
  {
    title: 'Executive Townhouse',
    description:
      'Luxury townhouse with modern design and premium finishes. Includes private garage and garden.',
    price: 5800000,
    priceType: 'total',
    type: 'house',
    status: 'for-sale',
    location: 'CMC',
    latitude: 9.0134,
    longitude: 38.7823,
    bedrooms: 3,
    bathrooms: 3,
    area: 220,
    amenities: JSON.stringify([
      'Garage',
      'Garden',
      'Security',
      'Elevator',
      'Maid Room',
    ]),
    featured: true,
  },
  {
    title: 'Budget Studio Apartment',
    description:
      'Affordable studio perfect for students or young professionals. All utilities included.',
    price: 12000,
    priceType: 'per-month',
    type: 'apartment',
    status: 'for-rent',
    location: 'Kirkos',
    latitude: 9.0099,
    longitude: 38.7634,
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    amenities: JSON.stringify(['Security', 'Internet', 'Water', 'Electricity']),
    featured: false,
  },
  {
    title: 'Warehouse Space',
    description:
      'Large warehouse with loading dock and storage facilities. Ideal for logistics or manufacturing.',
    price: 45000,
    priceType: 'per-month',
    type: 'commercial',
    status: 'for-rent',
    location: 'Kazanchis',
    latitude: 8.9876,
    longitude: 38.789,
    bedrooms: 0,
    bathrooms: 1,
    area: 800,
    amenities: JSON.stringify([
      'Loading Dock',
      'Security',
      'Parking',
      'Storage',
    ]),
    featured: false,
  },
  {
    title: 'Luxury Penthouse Suite',
    description:
      'Ultimate luxury living with private elevator, rooftop pool access, and concierge service.',
    price: 12000000,
    priceType: 'total',
    type: 'apartment',
    status: 'for-sale',
    location: 'Bole',
    latitude: 9.0087,
    longitude: 38.7701,
    bedrooms: 4,
    bathrooms: 4,
    area: 250,
    amenities: JSON.stringify([
      'Private Elevator',
      'Rooftop Pool',
      'Concierge',
      'Security',
      'Gym',
      'Spa',
    ]),
    featured: true,
  },
];

async function main() {
  console.log('Seeding mock properties...');

  // Find admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@shoahomes.com';
  const admin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!admin) {
    console.error('Admin user not found. Please run npm run seed:admin first.');
    process.exit(1);
  }

  console.log(`Found admin user: ${admin.id}`);

  // Clear existing properties (optional, uncomment if needed)
  // await prisma.property.deleteMany();

  let createdCount = 0;
  for (const propertyData of mockProperties) {
    try {
      // Remove legacy price fields before creating (schema no longer contains them)
      const { price, priceType, ...data } = propertyData;
      const property = await prisma.property.create({
        data: {
          ...data,
          userId: admin.id,
        },
      });
      console.log(`Created property: ${property.title}`);
      createdCount++;
    } catch (error) {
      console.error(
        `Failed to create property "${propertyData.title}":`,
        error.message
      );
    }
  }

  console.log(`Successfully created ${createdCount} mock properties.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

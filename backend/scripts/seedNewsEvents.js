import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedNewsEvents() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) {
    console.log('No admin user found');
    return;
  }

  const newsEvents = [
    {
      title: 'New Luxury Development Launch',
      excerpt: 'Exciting news about our latest luxury residential project',
      content:
        'We are thrilled to announce the launch of our newest luxury development in Bole, featuring modern amenities and premium finishes.',
      type: 'news',
      category: 'Product Launch',
      date: new Date('2026-02-15'),
      published: true,
      createdById: admin.id,
    },
    {
      title: 'Community Open House Event',
      excerpt: 'Join us for an open house at our CMC villa project',
      content:
        'Come visit our stunning villa development in CMC. See the premium finishes and modern design in person.',
      type: 'event',
      category: 'Open House',
      date: new Date('2026-02-20'),
      time: '10:00 AM - 4:00 PM',
      location: 'CMC Villa Project Site',
      published: true,
      createdById: admin.id,
    },
    {
      title: 'Construction Update: Bole Apartments',
      excerpt: 'Major progress on our Bole apartment complex',
      content:
        'Our Bole apartment project is now 75% complete. The modern design and quality construction are on track for Q2 delivery.',
      type: 'news',
      category: 'Construction Update',
      date: new Date('2026-02-10'),
      published: true,
      createdById: admin.id,
    },
  ];

  for (const item of newsEvents) {
    await prisma.newsEvent.create({ data: item });
    console.log('Created:', item.title);
  }

  console.log('News and events seeded successfully');
}

seedNewsEvents()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

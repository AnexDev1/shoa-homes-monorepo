import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Helper to save locally
const saveLocally = async (file, filename) => {
  const uploadDir = path.join(
    __dirname,
    '../../uploads/shoa-homes/news-events'
  );
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  // Use copyFile instead of rename to handle cross-device links
  await fs.copyFile(file.tempFilePath, filePath);
  // Clean up the temp file
  await fs.unlink(file.tempFilePath);
  return {
    url: `/uploads/shoa-homes/news-events/${filename}`,
    publicId: null,
  };
};

// ────────────────────────── Admin Endpoints ──────────────────────────

// Get all news/events (admin - includes unpublished)
const adminGetAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, category } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (type) where.type = type;
    if (category) where.category = category;

    const [items, total] = await Promise.all([
      prisma.newsEvent.findMany({
        where,
        include: { createdBy: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit),
      }),
      prisma.newsEvent.count({ where }),
    ]);

    res.json({
      data: items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching news/events:', error);
    res.status(500).json({ message: 'Failed to fetch news/events' });
  }
};

// Create news/event
const create = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      type,
      category,
      date,
      time,
      location,
      published,
    } = req.body;
    const userId = req.user.id;

    let imageData = null;
    if (req.files && req.files.image) {
      const file = req.files.image;
      const filename = `${Date.now()}-${file.name}`;
      imageData = await saveLocally(file, filename);
    }

    const newsEvent = await prisma.newsEvent.create({
      data: {
        title,
        excerpt,
        content,
        type,
        category,
        date: new Date(date),
        time: time || null,
        location: location || null,
        image: imageData?.url || null,
        imagePublicId: imageData?.publicId || null,
        published: published === 'true',
        createdById: userId,
      },
      include: { createdBy: { select: { name: true } } },
    });

    res.status(201).json({ data: newsEvent });
  } catch (error) {
    console.error('Error creating news/event:', error);
    res.status(500).json({ message: 'Failed to create news/event' });
  }
};

// Update news/event
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      type,
      category,
      date,
      time,
      location,
      published,
      removeImage,
    } = req.body;

    const existing = await prisma.newsEvent.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'News/Event not found' });
    }

    let imageData = {
      image: existing.image,
      imagePublicId: existing.imagePublicId,
    };

    // Handle image removal
    if (removeImage === 'true') {
      if (existing.image) {
        try {
          const imagePath = path.join(
            __dirname,
            '../../uploads/shoa-homes/news-events',
            path.basename(existing.image)
          );
          await fs.unlink(imagePath);
        } catch (error) {
          console.error('Failed to delete local image:', error);
        }
      }
      imageData = { image: null, imagePublicId: null };
    }

    // Handle new image upload
    if (req.files && req.files.image) {
      // Delete old image if exists
      if (existing.image) {
        try {
          const imagePath = path.join(
            __dirname,
            '../../uploads/shoa-homes/news-events',
            path.basename(existing.image)
          );
          await fs.unlink(imagePath);
        } catch (error) {
          console.error('Failed to delete old local image:', error);
        }
      }

      const file = req.files.image;
      const filename = `${Date.now()}-${file.name}`;
      imageData = await saveLocally(file, filename);
    }

    const newsEvent = await prisma.newsEvent.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        type,
        category,
        date: new Date(date),
        time: time !== undefined ? time || null : existing.time,
        location: location !== undefined ? location || null : existing.location,
        image: imageData.image,
        imagePublicId: imageData.imagePublicId,
        published: published === 'true',
      },
      include: { createdBy: { select: { name: true } } },
    });

    res.json({ data: newsEvent });
  } catch (error) {
    console.error('Error updating news/event:', error);
    res.status(500).json({ message: 'Failed to update news/event' });
  }
};

// Delete news/event
const deleteNewsEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.newsEvent.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'News/Event not found' });
    }

    // Delete image from local storage if exists
    if (existing.image) {
      try {
        const imagePath = path.join(
          __dirname,
          '../../uploads/shoa-homes/news-events',
          path.basename(existing.image)
        );
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Failed to delete local image:', error);
      }
    }

    await prisma.newsEvent.delete({ where: { id } });
    res.json({ message: 'News/Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting news/event:', error);
    res.status(500).json({ message: 'Failed to delete news/event' });
  }
};

// ────────────────────────── Public Endpoints ──────────────────────────

// Get published news/events for public
const getPublished = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const skip = (page - 1) * limit;

    const where = { published: true };
    if (type) where.type = type;

    const [items, total] = await Promise.all([
      prisma.newsEvent.findMany({
        where,
        include: { createdBy: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit),
      }),
      prisma.newsEvent.count({ where }),
    ]);

    res.json({
      data: items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching published news/events:', error);
    res.status(500).json({ message: 'Failed to fetch news/events' });
  }
};

// Get single news/event by ID (public)
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const newsEvent = await prisma.newsEvent.findUnique({
      where: { id },
      include: { createdBy: { select: { name: true } } },
    });

    if (!newsEvent || !newsEvent.published) {
      return res.status(404).json({ message: 'News/Event not found' });
    }

    res.json({ data: newsEvent });
  } catch (error) {
    console.error('Error fetching news/event:', error);
    res.status(500).json({ message: 'Failed to fetch news/event' });
  }
};

export default {
  adminGetAll,
  create,
  update,
  delete: deleteNewsEvent,
  getPublished,
  getById,
};

import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';

const SALT_ROUNDS = 10;

// Valid roles for the user
const VALID_ROLES = ['USER', 'AGENT', 'ADMIN'];

export const createUser = async (req, res) => {
  try {
    const { email, password, name, phone, role = 'USER' } = req.body;

    // Validate role
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        message: `Role must be one of: ${VALID_ROLES.join(', ')}`,
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: role || 'USER', // Default to USER if role not provided
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res
        .status(400)
        .json({ error: 'Database error', details: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleAgentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res
        .status(400)
        .json({ error: 'isActive must be a boolean value' });
    }

    // Check if user exists and is an agent
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'AGENT') {
      return res
        .status(400)
        .json({ error: 'Only agent accounts can be activated/deactivated' });
    }

    // Prevent deactivating your own account
    if (req.user.id === id) {
      return res
        .status(400)
        .json({ error: 'You cannot deactivate your own account' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: `Agent ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Error toggling agent status:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res
        .status(400)
        .json({ error: 'Database error', details: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deletion of the last admin
    const userToDelete = await prisma.user.findUnique({
      where: { id },
    });

    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Count remaining admins if we're deleting an admin
    if (userToDelete.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' },
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          error: 'Cannot delete the last admin',
          message: 'There must be at least one admin user in the system',
        });
      }
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

/**
 * Get clients by agent ID (Admin only)
 * @route GET /api/users/agents/:agentId/clients
 * @access Private/Admin
 */
export const getAgentClients = async (req, res) => {
  try {
    const { agentId } = req.params;

    // Check if the agent exists and is an agent
    const agent = await prisma.user.findUnique({
      where: {
        id: agentId,
        role: 'AGENT',
      },
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      });
    }

    const clients = await prisma.client.findMany({
      where: {
        agentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    console.error('Error fetching agent clients:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

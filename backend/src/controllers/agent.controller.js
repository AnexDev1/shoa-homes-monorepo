import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';

export const addClient = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { name, email, phone, status = 'Active' } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }

    // Check if client with this email already exists for this agent
    const existingClient = await prisma.client.findFirst({
      where: {
        email,
        agentId,
      },
    });

    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'A client with this email already exists',
      });
    }

    // Create new client
    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone: phone || null,
        notes: req.body.notes || null, // Add notes field
        status,
        agent: {
          connect: { id: agentId },
        },
      },
    });
    res.status(201).json({
      success: true,
      data: client,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({
        success: false,
        message: error.message,
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
    });
  }
};

export const updateClient = async (req, res) => {
  try {
    const agentId = req.user.id;
    const clientId = req.params.id;
    const { name, email, phone, notes, status } = req.body;

    // Check if client exists and belongs to the agent
    const existingClient = await prisma.client.findFirst({
      where: {
        id: clientId,
        agentId,
      },
    });

    if (!existingClient) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    // Check if email is being updated to an existing one
    if (email && email !== existingClient.email) {
      const emailExists = await prisma.client.findFirst({
        where: {
          email,
          agentId,
          NOT: {
            id: clientId,
          },
        },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'A client with this email already exists',
        });
      }
    }

    // Update client
    const updatedClient = await prisma.client.update({
      where: {
        id: clientId,
      },
      data: {
        name: name || existingClient.name,
        email: email || existingClient.email,
        phone: phone !== undefined ? phone : existingClient.phone,
        notes: notes !== undefined ? notes : existingClient.notes,
        status: status || existingClient.status,
      },
    });

    res.json({
      success: true,
      data: updatedClient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const agentId = req.user.id;
    const clientId = req.params.id;

    // Check if client exists and belongs to the agent
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        agentId,
      },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    // Delete client
    await prisma.client.delete({
      where: {
        id: clientId,
      },
    });

    res.json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getAgentClients = async (req, res) => {
  try {
    const agentId = req.user.id;

    const clients = await prisma.client.findMany({
      where: {
        agentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

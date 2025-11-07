import bcrypt from 'bcryptjs';
import { generateToken } from '../config/jwt.js';

// Mock user data for development
const mockUsers = [
  {
    id: '1',
    email: 'admin@shoahomes.com',
    password: '$2a$10$YourHashedPasswordHere', // 'admin123' hashed
    name: 'Admin User',
    phone: '+251 911 000000',
    role: 'ADMIN',
  },
  {
    id: '2',
    email: 'user@shoahomes.com',
    password: '$2a$10$YourHashedPasswordHere', // 'user123' hashed
    name: 'Regular User',
    phone: '+251 922 000000',
    role: 'USER',
  },
];

export const register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Mock implementation
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      phone,
      role: 'USER',
    };

    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Mock implementation for demo
    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // For demo, accept predefined passwords
    const validPasswords = {
      'admin@shoahomes.com': 'admin123',
      'user@shoahomes.com': 'user123',
    };

    if (password !== validPasswords[email]) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    // Mock implementation
    const user = mockUsers[0];

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message,
    });
  }
};

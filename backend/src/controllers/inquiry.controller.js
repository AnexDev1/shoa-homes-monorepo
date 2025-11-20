import prisma from '../config/prisma.js';

// Inquiry controller removed — features removed in favor of offline phone/email contact

export const createInquiry = async (req, res) => {
  res
    .status(410)
    .json({ success: false, message: 'Inquiries feature removed' });
};

export const getAllInquiries = async (req, res) => {
  res
    .status(410)
    .json({ success: false, message: 'Inquiries feature removed' });
};

export const markInquiryAsRead = async (req, res) => {
  res
    .status(410)
    .json({ success: false, message: 'Inquiries feature removed' });
};

export const replyToInquiry = async (req, res) => {
  res
    .status(410)
    .json({ success: false, message: 'Inquiries feature removed' });
};

export const getMyInquiries = async (req, res) => {
  res
    .status(410)
    .json({ success: false, message: 'Inquiries feature removed' });
};

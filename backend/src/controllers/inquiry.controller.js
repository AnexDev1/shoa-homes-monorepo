// Mock inquiry data
let inquiries = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+251 911 123456',
    message: 'I am interested in viewing this property.',
    propertyId: '1',
    status: 'unread',
    createdAt: new Date().toISOString(),
  },
];

export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message, propertyId } = req.body;

    const newInquiry = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      message,
      propertyId,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };

    inquiries.push(newInquiry);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: newInquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry',
      error: error.message,
    });
  }
};

export const getAllInquiries = async (req, res) => {
  try {
    const { status } = req.query;

    let filtered = [...inquiries];

    if (status && status !== 'all') {
      filtered = filtered.filter(i => i.status === status);
    }

    res.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiries',
      error: error.message,
    });
  }
};

export const markInquiryAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const index = inquiries.findIndex(i => i.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    inquiries[index].status = 'read';

    res.json({
      success: true,
      message: 'Inquiry marked as read',
      data: inquiries[index],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update inquiry',
      error: error.message,
    });
  }
};

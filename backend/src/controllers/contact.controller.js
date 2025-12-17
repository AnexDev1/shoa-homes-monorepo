import nodemailer from 'nodemailer';

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
      });
    }

    // Load SMTP credentials from environment
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    // Check if SMTP credentials are configured
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error('SMTP credentials not configured');
      return res.status(500).json({
        success: false,
        error: 'Email service not configured',
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Format the email content
    const emailSubject = `[Shoa Homes Contact] ${subject}`;
    const emailText = `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject}
Message:
---
${message}
    `;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Subject:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${subject}</td>
          </tr>
        </table>
        <div style="margin-top: 20px;">
          <h3>Message:</h3>
          <div style="padding: 15px; border: 1px solid #ddd; border-radius: 4px; white-space: pre-wrap;">${message}</div>
        </div>
      </div>
    `;

    // Send the email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: smtpUser,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Email sending failed:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to send message',
    });
  }
};

export const getContactInfo = async (req, res) => {
  return res.status(405).json({
    error: 'Method Not Allowed',
  });
};

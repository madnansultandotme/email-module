const nodemailer = require('nodemailer');

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Main handler function for Vercel serverless
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed. Only POST requests are supported.' 
    });
  }

  try {
    // Extract and validate request body
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: 'Missing required fields. Please provide name, email, subject, and message.'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format.'
      });
    }

    // Validate field lengths
    if (name.length > 100 || subject.length > 200 || message.length > 2000) {
      return res.status(400).json({
        error: 'Field length exceeded. Name: 100 chars, Subject: 200 chars, Message: 2000 chars max.'
      });
    }

    // Get environment variables
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;
    const adminEmail = process.env.ADMIN_EMAIL;

    // Validate environment variables
    if (!gmailUser || !gmailPass || !adminEmail) {
      console.error('Missing environment variables');
      return res.status(500).json({
        error: 'Server configuration error. Please try again later.'
      });
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    // Email content
    const mailOptions = {
      from: `"${name}" <${gmailUser}>`,
      to: adminEmail,
      subject: `Contact Form: ${subject} - from ${name}`,
      text: `
Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This email was sent from your contact form.
      `,
html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 20px auto; background-color: #f0f4fa; border-radius: 10px; padding: 20px; border: 1px solid #e0e0e0;">
          <header style="background-color: #003366; color: #ffffff; text-align: center; padding: 10px 0; border-radius: 10px 10px 0 0;">
            <h2 style="margin: 0;">Contact Form Submission</h2>
          </header>

          <section style="background-color: #ffffff; padding: 20px; border-radius: 0 0 10px 10px;">
            <p style="color: #444;">
              <strong>Name:</strong> ${name}
            </p>
            <p style="color: #444;">
              <strong>Email:</strong> <a href="mailto:${email}" style="color: #1a73e8; text-decoration: none;">${email}</a>
            </p>
            <p style="color: #444;">
              <strong>Subject:</strong> ${subject}
            </p>
            <p style="color: #444;">
              <strong>Message:</strong>
            </p>
            <blockquote style="color: #444; background-color: #f7f9fc; border-left: 4px solid #003366; margin: 10px 0; padding: 10px;">
              ${message}
            </blockquote>
          </section>

          <footer style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
            <p>
              This email was sent from your contact form. Please do not reply to this email directly.
            </p>
          </footer>
        </div>
      `,
      replyTo: email
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully!',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    // Handle specific nodemailer errors
    if (error.code === 'EAUTH') {
      return res.status(500).json({
        error: 'Authentication failed. Please check email credentials.'
      });
    }
    
    if (error.code === 'ECONNECTION') {
      return res.status(500).json({
        error: 'Connection failed. Please check your internet connection.'
      });
    }
    
    return res.status(500).json({
      error: 'Failed to send email. Please try again later.'
    });
  }
};

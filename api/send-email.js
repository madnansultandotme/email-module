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
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    // Email content
    const mailOptions = {
      from: `"Website Contact Form" <${gmailUser}>`,
      to: adminEmail,
      subject: `🔔 New Contact: ${name} sent you a message - "${subject}"`,
      text: `
Hi there!

You have received a new message from your website contact form.

👤 VISITOR DETAILS:
Name: ${name}
Email: ${email}
Subject: ${subject}

💬 MESSAGE FROM ${name.toUpperCase()}:
${message}

---
📧 Reply directly to ${email} to respond to this person.
🌐 This message was sent from your website contact form.
      `,
html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 20px auto; background-color: #f0f4fa; border-radius: 10px; padding: 20px; border: 1px solid #e0e0e0;">
          <header style="background-color: #003366; color: #ffffff; text-align: center; padding: 15px 0; border-radius: 10px 10px 0 0;">
            <h2 style="margin: 0; font-size: 18px;">🔔 New Contact from Your Website</h2>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">${name} sent you a message</p>
          </header>

          <section style="background-color: #ffffff; padding: 25px; border-radius: 0 0 10px 10px;">
            <div style="background-color: #e8f4f8; border-left: 4px solid #003366; padding: 15px; margin-bottom: 20px; border-radius: 0 5px 5px 0;">
              <h3 style="margin: 0 0 10px 0; color: #003366; font-size: 16px;">👤 Visitor Information</h3>
              <p style="margin: 5px 0; color: #444;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 5px 0; color: #444;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #1a73e8; text-decoration: none; font-weight: bold;">${email}</a></p>
              <p style="margin: 5px 0; color: #444;"><strong>Subject:</strong> ${subject}</p>
            </div>

            <div style="margin: 20px 0;">
              <h3 style="color: #003366; font-size: 16px; margin: 0 0 10px 0;">💬 Message from ${name}:</h3>
              <div style="background-color: #f9f9f9; border: 1px solid #e0e0e0; padding: 15px; border-radius: 5px; line-height: 1.6; color: #333;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin-top: 20px; text-align: center;">
              <p style="margin: 0; color: #003366; font-weight: bold;">📧 Ready to Reply?</p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Click on <a href="mailto:${email}" style="color: #1a73e8; text-decoration: none;">${email}</a> above to respond directly to ${name}</p>
            </div>
          </section>

          <footer style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
            <p style="margin: 0;">🌐 This message was sent from your website contact form</p>
            <p style="margin: 5px 0 0 0;">Sent on ${new Date().toLocaleString()}</p>
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

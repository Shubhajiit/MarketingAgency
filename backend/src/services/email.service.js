const nodemailer = require('nodemailer');
const { SESClient, SendRawEmailCommand } = require('@aws-sdk/client-ses');
const { env } = require('../config/env');
const logger = require('../utils/logger');

let transporter = null;

/**
 * Initialize email transporter.
 * Uses AWS SES in production, console logging in development.
 */
const getTransporter = () => {
  if (transporter) return transporter;

  if (env.SMTP_HOST && env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
    logger.info('Email transporter: Nodemailer SMTP');
  } else if (env.NODE_ENV === 'production' && env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
    const ses = new SESClient({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });

    transporter = nodemailer.createTransport({
      SES: { ses, aws: { SendRawEmailCommand } },
    });

    logger.info('Email transporter: AWS SES');
  } else {
    // Development: log emails to console
    transporter = {
      sendMail: async (options) => {
        logger.info('📧 Email sent (dev mode):', {
          to: options.to,
          subject: options.subject,
        });
        logger.debug('Email body:', options.html || options.text);
        return { messageId: `dev-${Date.now()}` };
      },
    };
    logger.info('Email transporter: Console (dev mode)');
  }

  return transporter;
};

/**
 * Send an email.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const transport = getTransporter();

  const mailOptions = {
    from: `AI Scale <${env.EMAIL_FROM}>`,
    to,
    subject,
    html,
    text: text || '',
  };

  const result = await transport.sendMail(mailOptions);
  logger.info(`Email sent to ${to}: ${result.messageId}`);
  return result;
};

/**
 * Booking confirmation email template.
 */
const sendBookingConfirmation = async ({ user, booking, workshop, slot }) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #009ee3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; }
        .detail { margin: 8px 0; }
        .label { font-weight: bold; color: #374151; }
        .footer { text-align: center; padding: 16px; font-size: 12px; color: #6b7280; }
        .button { display: inline-block; background: #009ee3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed! ✅</h1>
        </div>
        <div class="content">
          <p>Hi ${user.name},</p>
          <p>Your workshop booking has been confirmed. Here are the details:</p>
          
          <div class="detail"><span class="label">Booking Reference:</span> ${booking._id}</div>
          <div class="detail"><span class="label">Workshop:</span> ${workshop.title}</div>
          <div class="detail"><span class="label">Instructor:</span> ${workshop.instructor}</div>
          <div class="detail"><span class="label">Date:</span> ${new Date(slot.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div class="detail"><span class="label">Time:</span> ${slot.startTime} - ${slot.endTime}</div>
          ${slot.meetingLink ? `<div class="detail"><span class="label">Meeting Link:</span> <a href="${slot.meetingLink}">${slot.meetingLink}</a></div>` : ''}
          <div class="detail"><span class="label">Amount Paid:</span> ₹${booking.amount}</div>
          
          <p style="margin-top: 20px;">If you have any questions, please contact us at <a href="mailto:support@aiscale.in">support@aiscale.in</a></p>
        </div>
        <div class="footer">
          <p>AI Scale • Workshop & Learning Platform</p>
          <p><a href="#">Manage preferences</a> | <a href="#">Unsubscribe</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: `Booking Confirmed: ${workshop.title}`,
    html,
  });
};

module.exports = { sendEmail, sendBookingConfirmation, getTransporter };

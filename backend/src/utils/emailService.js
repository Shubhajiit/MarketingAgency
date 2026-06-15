const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Workshop = require('../models/Workshop');

const getLocalDateString = (dateInput) => {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

const determineVenue = (registration, workshop) => {
  if (!workshop || !workshop.workshopDates || !Array.isArray(workshop.workshopDates)) {
    return 'Online Live Session (Zoom/Meet)';
  }

  const regDateStr = getLocalDateString(registration.selectedDate);
  if (!regDateStr) {
    return 'Online Live Session (Zoom/Meet)';
  }

  // Find matching date entry
  const match = workshop.workshopDates.find((d) => {
    if (!d) return false;
    let dDateStr = '';
    if (typeof d === 'string') {
      dDateStr = getLocalDateString(d);
    } else if (d.date) {
      dDateStr = getLocalDateString(d.date);
    }
    return dDateStr === regDateStr;
  });

  if (match && match.place) {
    const place = match.place.trim();
    const lowerPlace = place.toLowerCase();
    if (lowerPlace === 'online' || lowerPlace.includes('zoom') || lowerPlace.includes('meet')) {
      return 'Online Live Session (Zoom/Meet)';
    }
    return place; // Show exact offline venue e.g. Mumbai, Delhi, etc.
  }

  return 'Online Live Session (Zoom/Meet)';
};

/**
 * Configure and return the Nodemailer transporter.
 * Returns null if SMTP configuration is missing.
 */
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: parseInt(port || '587'),
      secure: parseInt(port || '587') === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return null;
};

/**
 * Formats dates nicely depending on workshop type.
 */
const formatWorkshopDates = (selectedDate, type) => {
  const dateObj = new Date(selectedDate);
  if (isNaN(dateObj.getTime())) {
    return 'As scheduled';
  }

  const formatDate = (d) => {
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (type === 'three-days') {
    const date2 = new Date(dateObj.getTime() + 86400000);
    const date3 = new Date(dateObj.getTime() + 172800000);
    return `${formatDate(dateObj)} to ${formatDate(date3)}\n(3 consecutive days: ${dateObj.getDate()}, ${date2.getDate()}, ${date3.getDate()} ${dateObj.toLocaleDateString('en-IN', { month: 'short' })})`;
  } else {
    return formatDate(dateObj);
  }
};

/**
 * Generates an in-memory PDF Invoice/Ticket buffer using PDFKit.
 */
const generateInvoicePDF = (registration, workshop) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // Color Palette
      const primaryColor = '#0052FF';
      const secondaryColor = '#0B132B';
      const lightBgColor = '#F8FAFC';
      const borderColor = '#E2E8F0';
      const textColor = '#334155';
      const titleColor = '#0F172A';

      // --- HEADER ---
      // Top color banner
      doc.rect(50, 40, 495, 8).fill(primaryColor);

      // Brand Title
      doc.fontSize(22)
        .fillColor(primaryColor)
        .font('Helvetica-Bold')
        .text('AI SCALE', 50, 65);

      doc.fontSize(9)
        .fillColor(textColor)
        .font('Helvetica')
        .text('Live Learning Platform', 50, 92);

      // Document Title (Right Aligned)
      doc.fontSize(14)
        .fillColor(titleColor)
        .font('Helvetica-Bold')
        .text('CONFIRMATION TICKET & INVOICE', 220, 65, { align: 'right', width: 325 });

      const invoiceNo = `INV-REG-${registration._id.toString().slice(-6).toUpperCase()}`;
      const issueDate = new Date(registration.createdAt || new Date()).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      doc.fontSize(9)
        .fillColor(textColor)
        .font('Helvetica')
        .text(`Invoice No: ${invoiceNo}`, 220, 85, { align: 'right', width: 325 })
        .text(`Date of Issue: ${issueDate}`, 220, 97, { align: 'right', width: 325 })
        .fillColor('#10B981')
        .font('Helvetica-Bold')
        .text(`Status: PAID`, 220, 109, { align: 'right', width: 325 });

      // Divider Line
      doc.moveTo(50, 135)
        .lineTo(545, 135)
        .strokeColor(borderColor)
        .lineWidth(1)
        .stroke();

      // --- TWO COLUMN SECTION ---
      const startY = 155;

      // Left Column: Participant Details
      doc.fontSize(11)
        .fillColor(secondaryColor)
        .font('Helvetica-Bold')
        .text('1. PARTICIPANT DETAILS', 50, startY);

      doc.fontSize(9)
        .fillColor(textColor)
        .font('Helvetica-Bold').text('Name:', 50, startY + 20)
        .font('Helvetica').text(registration.name, 125, startY + 20)

        .font('Helvetica-Bold').text('Email:', 50, startY + 35)
        .font('Helvetica').text(registration.email, 125, startY + 35)

        .font('Helvetica-Bold').text('Phone:', 50, startY + 50)
        .font('Helvetica').text(registration.phone, 125, startY + 50)

        .font('Helvetica-Bold').text('WhatsApp:', 50, startY + 65)
        .font('Helvetica').text(registration.whatsappNumber || registration.phone, 125, startY + 65)

        .font('Helvetica-Bold').text('Age Group:', 50, startY + 80)
        .font('Helvetica').text(registration.age || 'N/A', 125, startY + 80)

        .font('Helvetica-Bold').text('Profession:', 50, startY + 95)
        .font('Helvetica').text(registration.profession || 'N/A', 125, startY + 95);

      // Right Column: Workshop Details
      doc.fontSize(11)
        .fillColor(secondaryColor)
        .font('Helvetica-Bold')
        .text('2. WORKSHOP DETAILS', 300, startY);

      const workshopTitle = workshop ? workshop.title : registration.workshopTitle;
      const workshopType = (workshop && workshop.type === 'three-days') ? '3-Day Live Workshop' : '1-Day Masterclass';
      const instructor = (workshop && workshop.instructor) ? workshop.instructor : 'AI Scale Expert';
      const formattedDates = formatWorkshopDates(registration.selectedDate, workshop ? workshop.type : 'one-day');
      const timeStr = "7:00 PM - 10:00 PM IST";
      const venueStr = determineVenue(registration, workshop);

      doc.fontSize(9)
        .fillColor(textColor)
        .font('Helvetica-Bold').text('Workshop:', 300, startY + 20)
        .font('Helvetica').text(workshopTitle, 370, startY + 20, { width: 175 })

        .font('Helvetica-Bold').text('Format:', 300, startY + 50)
        .font('Helvetica').text(workshopType, 370, startY + 50)

        .font('Helvetica-Bold').text('Instructor:', 300, startY + 65)
        .font('Helvetica').text(instructor, 370, startY + 65)

        .font('Helvetica-Bold').text('Dates:', 300, startY + 80)
        .font('Helvetica').text(formattedDates, 370, startY + 80, { width: 175 })

        .font('Helvetica-Bold').text('Time:', 300, startY + 120)
        .font('Helvetica').text(timeStr, 370, startY + 120)

        .font('Helvetica-Bold').text('Venue:', 300, startY + 135)
        .font('Helvetica').text(venueStr, 370, startY + 135);

      // Divider Line
      doc.moveTo(50, 310)
        .lineTo(545, 310)
        .strokeColor(borderColor)
        .lineWidth(1)
        .stroke();

      // --- PAYMENT SUMMARY ---
      doc.fontSize(11)
        .fillColor(secondaryColor)
        .font('Helvetica-Bold')
        .text('3. BILLING & PAYMENT SUMMARY', 50, 330);

      // Table Header
      const tableTop = 350;
      doc.rect(50, tableTop, 495, 20).fill(lightBgColor);
      doc.fontSize(9)
        .fillColor(textColor)
        .font('Helvetica-Bold')
        .text('Item Description', 60, tableTop + 6)
        .text('Qty', 350, tableTop + 6, { width: 40, align: 'center' })
        .text('Amount Paid', 430, tableTop + 6, { width: 100, align: 'right' });

      // Table Row
      const totalAmount = registration.amountPaid || 0;
      const basePrice = Math.round(totalAmount / 1.18);
      const gstAmount = totalAmount - basePrice;
      const currency = registration.currency || 'INR';
      const currencySymbol = currency === 'INR' ? 'INR' : currency;

      const rowTop = tableTop + 20;
      doc.rect(50, rowTop, 495, 35).strokeColor(borderColor).stroke();
      doc.fontSize(9)
        .fillColor(textColor)
        .font('Helvetica')
        .text(`Registration ticket for ${workshopTitle}\n(Format: ${workshopType})`, 60, rowTop + 8, { width: 280 })
        .text('1', 350, rowTop + 8, { width: 40, align: 'center' })
        .text(`${currencySymbol} ${basePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 430, rowTop + 8, { width: 100, align: 'right' });

      // Calculations
      const subtotalTop = rowTop + 45;
      doc.fontSize(9)
        .fillColor(textColor)
        .font('Helvetica').text('Subtotal:', 340, subtotalTop, { width: 100, align: 'right' })
        .text(`${currencySymbol} ${basePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 450, subtotalTop, { width: 95, align: 'right' })

        .text('CGST/SGST (18%):', 340, subtotalTop + 15, { width: 100, align: 'right' })
        .text(`${currencySymbol} ${gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 450, subtotalTop + 15, { width: 95, align: 'right' });

      // Total Box
      const totalBoxTop = subtotalTop + 35;
      doc.rect(340, totalBoxTop, 205, 25).fill(primaryColor);
      doc.fontSize(10)
        .fillColor('#FFFFFF')
        .font('Helvetica-Bold')
        .text('Total Paid:', 350, totalBoxTop + 8, { width: 80, align: 'left' })
        .text(`${currencySymbol} ${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 435, totalBoxTop + 8, { width: 100, align: 'right' });

      // Razorpay Audit Info
      if (registration.paymentId || registration.razorpayOrderId) {
        doc.fontSize(8)
          .fillColor(textColor)
          .font('Helvetica-Oblique')
          .text(`Razorpay Order ID: ${registration.razorpayOrderId || 'N/A'}  |  Payment ID: ${registration.paymentId || 'N/A'}`, 50, totalBoxTop + 35);
      }

      // Divider Line
      doc.moveTo(50, totalBoxTop + 55)
        .lineTo(545, totalBoxTop + 55)
        .strokeColor(borderColor)
        .lineWidth(1)
        .stroke();

      // --- INSTRUCTIONS ---
      const instructionsTop = totalBoxTop + 70;
      doc.fontSize(10)
        .fillColor(secondaryColor)
        .font('Helvetica-Bold')
        .text('IMPORTANT INSTRUCTIONS', 50, instructionsTop);

      const isOnline = venueStr.toLowerCase().includes('online') || venueStr.toLowerCase().includes('zoom') || venueStr.toLowerCase().includes('meet');
      const pdfInstructions = isOnline
        ? [
          'Live Zoom/Google Meet session links will be sent to you 2 hours before the start of the session.',
          'Please join 10 minutes prior using a laptop/computer for the best hands-on learning experience.',
          'Ensure you have a stable internet connection and Zoom/Meet application installed.',
          'Workshop recording access and toolkits will be shared via email within 24 hours after the session.'
        ]
        : [
          `This is an offline, in-person session held at: ${venueStr}.`,
          'Please reach the venue 15 minutes prior to the scheduled start time.',
          'Bring a copy of this ticket (printed or on your phone) for check-in at the entrance.',
          'Ensure you carry a laptop or writing materials if requested by the instructor.'
        ];

      doc.fontSize(8.5)
        .fillColor(textColor)
        .font('Helvetica')
        .list(pdfInstructions, 50, instructionsTop + 18, { lineGap: 4 });

      // --- FOOTER ---
      doc.fontSize(8)
        .fillColor(textColor)
        .font('Helvetica')
        .text('Thank you for choosing AI Scale. We look forward to meeting you at the session!', 50, 720, { align: 'center', width: 495 })
        .text('Need help? Email: contact@aiscale.com  |  Support Phone: +91 1800 4122 6965', 50, 735, { align: 'center', width: 495 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Constructs a responsive HTML email template for confirmation.
 */
const buildConfirmationHtml = (registration, workshop) => {
  const workshopTitle = workshop ? workshop.title : registration.workshopTitle;
  const workshopType = (workshop && workshop.type === 'three-days') ? '3-Day Live Workshop' : '1-Day Masterclass';
  const formattedDates = formatWorkshopDates(registration.selectedDate, workshop ? workshop.type : 'one-day').replace(/\n/g, ' ');
  const amountStr = `${registration.currency === 'INR' ? 'Rs.' : registration.currency} ${registration.amountPaid.toLocaleString('en-IN')}`;

  const venue = determineVenue(registration, workshop);
  const isOnline = venue.toLowerCase().includes('online') || venue.toLowerCase().includes('zoom') || venue.toLowerCase().includes('meet');
  const instructionsHtml = isOnline
    ? `<strong>Important Session Join Info:</strong><br>
       A dedicated Zoom/Meet session link will be sent to your registered email and WhatsApp number exactly 2 hours prior to the workshop start time. Please join 10 minutes early via a laptop or desktop computer to complete the interactive activities.`
    : `<strong>Important Venue Entry Info:</strong><br>
       This is an in-person, offline workshop. Please reach the venue (<strong>${venue}</strong>) at least 15 minutes prior to the scheduled start time. Ensure you have a copy of this confirmation ticket for entry.`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Workshop Registration Confirmed</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background-color: #0052FF; padding: 40px 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; }
        .content { padding: 30px; }
        .greeting { font-size: 16px; line-height: 1.5; margin-bottom: 20px; }
        .details-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 25px; }
        .details-box table { width: 100%; border-collapse: collapse; }
        .details-box td { padding: 8px 0; font-size: 14px; vertical-align: top; }
        .details-box td.label { font-weight: bold; color: #0f172a; width: 130px; }
        .details-box td.value { color: #475569; }
        .button-container { text-align: center; margin-top: 30px; margin-bottom: 20px; }
        .instructions { font-size: 13px; line-height: 1.6; color: #64748b; background-color: #eff6ff; border-left: 4px solid #0052FF; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 25px; }
        .footer { text-align: center; font-size: 12px; color: #94a3b8; padding: 20px; border-top: 1px solid #f1f5f9; background-color: #f8fafc; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed! 🎉</h1>
        </div>
        <div class="content">
          <p class="greeting">Dear <strong>${registration.name}</strong>,</p>
          <p class="greeting">Thank you for registering for the <strong>${workshopTitle}</strong>! Your registration is complete and your payment of <strong>${amountStr}</strong> has been successfully received.</p>
          
          <div class="details-box">
            <table>
              <tr>
                <td class="label">Workshop:</td>
                <td class="value">${workshopTitle}</td>
              </tr>
              <tr>
                <td class="label">Format:</td>
                <td class="value">${workshopType}</td>
              </tr>
              <tr>
                <td class="label">Selected Date:</td>
                <td class="value">${formattedDates}</td>
              </tr>
              <tr>
                <td class="label">Time:</td>
                <td class="value">7:00 PM - 10:00 PM IST</td>
              </tr>
              <tr>
                <td class="label">Venue:</td>
                <td class="value">${venue}</td>
              </tr>
            </table>
          </div>

          <div class="instructions">
            ${instructionsHtml}
          </div>

          <p class="greeting">We have attached your official registration confirmation ticket and invoice (PDF) to this email for your records.</p>
          <p class="greeting">If you have any questions or require any assistance, please reply directly to this email or contact our support team.</p>
          
          <p class="greeting" style="margin-top: 30px;">Best regards,<br><strong>AI Scale Learning Team</strong></p>
        </div>
        <div class="footer">
          &copy; 2026 AI Scale Platform. All rights reserved.<br>
          For help, email us at contact@aiscale.com or call +91 1800 4122 6965.
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Main function: Generates the confirmation invoice PDF and sends it to the user's registered email.
 * Asynchronous, handles errors gracefully without throwing.
 */
const sendWorkshopConfirmationEmail = async (registration, workshopArg = null) => {
  try {
    console.log(`[EmailService] Starting confirmation flow for Registration ID: ${registration._id}`);

    // 1. Fetch workshop if not provided
    let workshop = workshopArg;
    if (!workshop && registration.workshopId) {
      workshop = await Workshop.findById(registration.workshopId);
    }

    const workshopTitle = workshop ? workshop.title : registration.workshopTitle;

    // 2. Generate PDF in-memory
    const pdfBuffer = await generateInvoicePDF(registration, workshop);
    console.log(`[EmailService] PDF Invoice successfully generated. Size: ${pdfBuffer.length} bytes`);

    // 3. Setup transporter
    const transporter = getTransporter();
    const emailFrom = process.env.EMAIL_FROM || 'noreply@aiscale.in';
    const emailTo = registration.email;

    if (!transporter) {
      // DEVELOPMENT FALLBACK: Log details and save PDF locally
      console.warn('[EmailService] SMTP credentials not configured. Falling back to local file system.');

      const tempMailsDir = path.join(__dirname, '../../temp_mails');
      if (!fs.existsSync(tempMailsDir)) {
        fs.mkdirSync(tempMailsDir, { recursive: true });
      }

      const safeRegId = registration._id.toString();
      const pdfPath = path.join(tempMailsDir, `invoice_${safeRegId}.pdf`);
      fs.writeFileSync(pdfPath, pdfBuffer);

      const htmlPath = path.join(tempMailsDir, `email_${safeRegId}.html`);
      const emailHtmlContent = buildConfirmationHtml(registration, workshop);
      fs.writeFileSync(htmlPath, emailHtmlContent);

      console.log(`[EmailService] [DEV LOG] Confirmation Email DETAILS:`);
      console.log(`  - From: ${emailFrom}`);
      console.log(`  - To: ${emailTo}`);
      console.log(`  - Subject: Booking Confirmed: ${workshopTitle}`);
      console.log(`  - Local PDF Invoice saved at: ${pdfPath}`);
      console.log(`  - Local Email HTML saved at: ${htmlPath}`);
      return { success: true, localSaved: true, pdfPath };
    }

    // 4. Send Email via SMTP
    const emailHtmlContent = buildConfirmationHtml(registration, workshop);
    const invoiceNo = `INV-REG-${registration._id.toString().slice(-6).toUpperCase()}`;

    const mailOptions = {
      from: `"AI Scale" <${emailFrom}>`,
      to: emailTo,
      subject: `Booking Confirmed: ${workshopTitle}`,
      html: emailHtmlContent,
      attachments: [
        {
          filename: `Workshop_Invoice_${invoiceNo}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Email sent successfully. MessageID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`[EmailService] Error in confirmation flow:`, error);
    // Graceful: do not throw to avoid failing parent checkout flows
    return { success: false, error: error.message };
  }
};

/**
 * Sends a contact form submission email to the company/admin email.
 * If SMTP settings are missing, saves the email as a HTML file in temp_mails folder (DEV mode).


/**
 * Constructs a responsive HTML email template for workshop cancellation.
 */
const buildCancellationHtml = (registration, workshop) => {
  const workshopTitle = workshop ? workshop.title : registration.workshopTitle;
  const workshopType = (workshop && workshop.type === 'three-days') ? '3-Day Live Workshop' : '1-Day Masterclass';
  const formattedDates = formatWorkshopDates(registration.selectedDate, workshop ? workshop.type : 'one-day').replace(/\n/g, ' ');
  const amountStr = `${registration.currency === 'INR' ? 'Rs.' : registration.currency} ${(registration.amountPaid || 0).toLocaleString('en-IN')}`;
  const venue = determineVenue(registration, workshop);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Important Update: Workshop Cancelled</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background-color: #EF4444; padding: 40px 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; }
        .content { padding: 30px; }
        .greeting { font-size: 16px; line-height: 1.5; margin-bottom: 20px; }
        .details-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 25px; }
        .details-box table { width: 100%; border-collapse: collapse; }
        .details-box td { padding: 8px 0; font-size: 14px; vertical-align: top; }
        .details-box td.label { font-weight: bold; color: #0f172a; width: 130px; }
        .details-box td.value { color: #475569; }
        .alert-box { font-size: 14px; line-height: 1.6; color: #b91c1c; background-color: #fef2f2; border-left: 4px solid #EF4444; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 25px; }
        .footer { text-align: center; font-size: 12px; color: #94a3b8; padding: 20px; border-top: 1px solid #f1f5f9; background-color: #f8fafc; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Important: Workshop Cancellation Notice</h1>
        </div>
        <div class="content">
          <p class="greeting">Dear <strong>${registration.name}</strong>,</p>
          <p class="greeting">We are writing to inform you that the upcoming workshop <strong>${workshopTitle}</strong> has been cancelled due to unforeseen circumstances. We sincerely apologize for any inconvenience this may cause you.</p>
          
          <div class="details-box">
            <h3 style="margin-top: 0; color: #0f172a; font-size: 15px;">Workshop Details:</h3>
            <table>
              <tr>
                <td class="label">Workshop:</td>
                <td class="value">${workshopTitle}</td>
              </tr>
              <tr>
                <td class="label">Format:</td>
                <td class="value">${workshopType}</td>
              </tr>
              <tr>
                <td class="label">Scheduled Date:</td>
                <td class="value">${formattedDates}</td>
              </tr>
              <tr>
                <td class="label">Venue:</td>
                <td class="value">${venue}</td>
              </tr>
            </table>
          </div>

          <div class="alert-box">
            <strong>Refund Information:</strong><br>
            Since you have successfully registered and paid <strong>${amountStr}</strong> for this session, a full refund has been automatically initiated. The refund amount will be credited back to your original payment method within the next <strong>7 days</strong>.
          </div>

          <p class="greeting">No further action is required from your side. If you do not receive the refund within 7 business days or have any questions, please reply directly to this email or contact our support team.</p>
          
          <p class="greeting" style="margin-top: 30px;">Warm regards,<br><strong>AI Scale Learning Team</strong></p>
        </div>
        <div class="footer">
          &copy; 2026 AI Scale Platform. All rights reserved.<br>
          For help, email us at contact@aiscale.com or call +91 1800 4122 6965.
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Sends a workshop cancellation email to a registered user.
 */
const sendWorkshopCancellationEmail = async (registration, workshopArg = null) => {
  try {
    console.log(`[EmailService] Starting cancellation email flow for Registration ID: ${registration._id}`);

    // Fetch workshop if not provided
    let workshop = workshopArg;
    if (!workshop && registration.workshopId) {
      workshop = await Workshop.findById(registration.workshopId);
    }

    const workshopTitle = workshop ? workshop.title : registration.workshopTitle;

    // Setup transporter
    const transporter = getTransporter();
    const emailFrom = process.env.EMAIL_FROM || 'noreply@aiscale.in';
    const emailTo = registration.email;

    if (!transporter) {
      // DEVELOPMENT FALLBACK: Log details and save HTML locally
      console.warn('[EmailService] SMTP credentials not configured. Saving cancellation email locally.');

      const tempMailsDir = path.join(__dirname, '../../temp_mails');
      if (!fs.existsSync(tempMailsDir)) {
        fs.mkdirSync(tempMailsDir, { recursive: true });
      }

      const safeRegId = registration._id.toString();
      const htmlPath = path.join(tempMailsDir, `cancel_email_${safeRegId}.html`);
      const emailHtmlContent = buildCancellationHtml(registration, workshop);
      fs.writeFileSync(htmlPath, emailHtmlContent);

      console.log(`[EmailService] [DEV LOG] Cancellation Email DETAILS:`);
      console.log(`  - From: ${emailFrom}`);
      console.log(`  - To: ${emailTo}`);
      console.log(`  - Subject: Important Update: Cancellation of ${workshopTitle}`);
      console.log(`  - Local Email HTML saved at: ${htmlPath}`);
      return { success: true, localSaved: true, htmlPath };
    }

    // Send Email via SMTP
    const emailHtmlContent = buildCancellationHtml(registration, workshop);

    const mailOptions = {
      from: `"AI Scale" <${emailFrom}>`,
      to: emailTo,
      subject: `Important Update: Cancellation of ${workshopTitle}`,
      html: emailHtmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Cancellation email sent successfully. MessageID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`[EmailService] Error in cancellation email flow:`, error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWorkshopConfirmationEmail,
  generateInvoicePDF,
  formatWorkshopDates,
  sendWorkshopCancellationEmail
};

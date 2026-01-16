import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { quoteFormSchema } from '@/lib/formValidation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the form data
    const validatedData = quoteFormSchema.parse(body);

    // Check for honeypot spam field
    if (body.website) {
      return NextResponse.json(
        { error: 'Spam detected' },
        { status: 400 }
      );
    }

    // Create transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Format the email content
    const fullAddress = `${validatedData.streetAddress}, ${validatedData.city}, ${validatedData.state} ${validatedData.zipCode}`;
    
    const emailContent = `
New Quote Request - ExterGen Group

CONTACT INFORMATION:
Name: ${validatedData.fullName}
Email: ${validatedData.email}
Phone: ${validatedData.phone}
Business: ${validatedData.businessName}

SERVICE DETAILS:
Facility Type: ${validatedData.facilityType}${validatedData.facilityTypeOther ? ` (${validatedData.facilityTypeOther})` : ''}
Address: ${fullAddress}
Square Footage: ${validatedData.squareFootage}
Cleaning Frequency: ${validatedData.cleaningFrequency}
Best Time to Contact: ${validatedData.bestTimeToContact || 'Not specified'}

Additional Details:
${validatedData.additionalDetails || 'None provided'}

---
Submitted: ${new Date().toLocaleString('en-US', {
  timeZone: 'America/New_York',
  dateStyle: 'full',
  timeStyle: 'long',
})}
    `.trim();

    // Send email to business
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM, // Send to info@extergengroup.com
      replyTo: validatedData.email,
      subject: `New Quote Request from ${validatedData.businessName}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0D1F2D;">New Quote Request - ExterGen Group</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #E56A1A; margin-top: 0;">CONTACT INFORMATION</h3>
            <p><strong>Name:</strong> ${validatedData.fullName}</p>
            <p><strong>Email:</strong> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${validatedData.phone}">${validatedData.phone}</a></p>
            <p><strong>Business:</strong> ${validatedData.businessName}</p>
          </div>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #E56A1A; margin-top: 0;">SERVICE DETAILS</h3>
            <p><strong>Facility Type:</strong> ${validatedData.facilityType}${validatedData.facilityTypeOther ? ` (${validatedData.facilityTypeOther})` : ''}</p>
            <p><strong>Address:</strong> ${fullAddress}</p>
            <p><strong>Square Footage:</strong> ${validatedData.squareFootage}</p>
            <p><strong>Cleaning Frequency:</strong> ${validatedData.cleaningFrequency}</p>
            <p><strong>Best Time to Contact:</strong> ${validatedData.bestTimeToContact || 'Not specified'}</p>
          </div>

          ${validatedData.additionalDetails ? `
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #E56A1A; margin-top: 0;">Additional Details</h3>
            <p style="white-space: pre-wrap;">${validatedData.additionalDetails}</p>
          </div>
          ` : ''}

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            Submitted: ${new Date().toLocaleString('en-US', {
              timeZone: 'America/New_York',
              dateStyle: 'full',
              timeStyle: 'long',
            })}
          </p>
        </div>
      `,
    });

    // Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: validatedData.email,
      subject: 'Thank You for Your Quote Request - ExterGen Group',
      text: `
Thank you for requesting a quote from ExterGen Group!

We've received your request and one of our team members will contact you within 24 hours to discuss your commercial cleaning needs.

Here's a summary of your request:

Business: ${validatedData.businessName}
Facility Type: ${validatedData.facilityType}
Location: ${fullAddress}
Cleaning Frequency: ${validatedData.cleaningFrequency}

If you have any questions in the meantime, please don't hesitate to contact us at info@extergengroup.com or call us directly.

Best regards,
The ExterGen Group Team
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0D1F2D;">Thank You for Your Quote Request!</h2>
          
          <p>We've received your request and one of our team members will contact you within <strong>24 hours</strong> to discuss your commercial cleaning needs.</p>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #E56A1A; margin-top: 0;">Request Summary</h3>
            <p><strong>Business:</strong> ${validatedData.businessName}</p>
            <p><strong>Facility Type:</strong> ${validatedData.facilityType}</p>
            <p><strong>Location:</strong> ${fullAddress}</p>
            <p><strong>Cleaning Frequency:</strong> ${validatedData.cleaningFrequency}</p>
          </div>

          <p>If you have any questions in the meantime, please don't hesitate to contact us at <a href="mailto:info@extergengroup.com">info@extergengroup.com</a>.</p>

          <p>Best regards,<br>The ExterGen Group Team</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'Quote request submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting quote:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid form data. Please check all fields.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit quote request. Please try again or call us at (555) 123-4567' },
      { status: 500 }
    );
  }
}

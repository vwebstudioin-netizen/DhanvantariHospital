import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: `"Dhanvantari Hospital" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      replyTo,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

export function getAppointmentConfirmationEmail(data: {
  patientName: string;
  serviceName: string;
  doctorName: string;
  date: string;
  time: string;
  locationName: string;
  type: string;
}) {
  return {
    subject: `Appointment Confirmation – Dhanvantari Hospital`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0d9488; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Dhanvantari Hospital</h1>
          <p style="margin: 4px 0 0; opacity: 0.9;">Appointment Confirmation</p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 24px; border-radius: 0 0 8px 8px;">
          <p>Dear <strong>${data.patientName}</strong>,</p>
          <p>Your appointment has been successfully scheduled!</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px 0; color: #6b7280;">Service:</td><td style="padding: 8px 0; font-weight: 600;">${data.serviceName}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Doctor:</td><td style="padding: 8px 0; font-weight: 600;">${data.doctorName}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Date:</td><td style="padding: 8px 0; font-weight: 600;">${data.date}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Time:</td><td style="padding: 8px 0; font-weight: 600;">${data.time}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Location:</td><td style="padding: 8px 0; font-weight: 600;">${data.locationName}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Type:</td><td style="padding: 8px 0; font-weight: 600;">${data.type === "telehealth" ? "Telehealth (Virtual)" : "In-Person"}</td></tr>
          </table>
          <p style="color: #6b7280; font-size: 14px;">Please arrive 15 minutes early. Bring your insurance card and photo ID. To reschedule, call us at (555) 100-2000 or visit your Patient Portal.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">Dhanvantari Hospital • Advanced Multi-Specialty Healthcare</p>
        </div>
      </div>
    `,
  };
}

export function getContactNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return {
    subject: `New Contact Form: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0d9488;">New Contact Message</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Name:</td><td style="padding: 8px 0;">${data.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Email:</td><td style="padding: 8px 0;">${data.email}</td></tr>
          ${data.phone ? `<tr><td style="padding: 8px 0; color: #6b7280;">Phone:</td><td style="padding: 8px 0;">${data.phone}</td></tr>` : ""}
          <tr><td style="padding: 8px 0; color: #6b7280;">Subject:</td><td style="padding: 8px 0;">${data.subject}</td></tr>
        </table>
        <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-top: 16px;">
          <p style="margin: 0; white-space: pre-line;">${data.message}</p>
        </div>
      </div>
    `,
  };
}

export function getJobApplicationEmail(data: {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
}) {
  return {
    subject: `New Job Application: ${data.jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0d9488;">New Job Application</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Position:</td><td style="padding: 8px 0; font-weight: 600;">${data.jobTitle}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Name:</td><td style="padding: 8px 0;">${data.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Email:</td><td style="padding: 8px 0;">${data.email}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Phone:</td><td style="padding: 8px 0;">${data.phone}</td></tr>
        </table>
        <p style="color: #6b7280; margin-top: 16px;">View the full application and resume in the admin panel.</p>
      </div>
    `,
  };
}

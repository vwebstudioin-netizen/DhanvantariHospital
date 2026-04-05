import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || "Dhanvantari Hospital <noreply@dhanvantarihospital.com>";
const HOSPITAL_EMAIL = process.env.HOSPITAL_EMAIL || "info@dhanvantarihospital.com";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not set — skipping email");
    return { success: false, error: "Resend API key not configured" };
  }
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
      replyTo,
    });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("[Email] Send error:", error);
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
    subject: `Appointment Confirmed — Dhanvantari Hospital`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:#1e3a5f;color:white;padding:20px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:22px">Dhanvantari Hospital</h1>
          <p style="margin:4px 0 0;opacity:0.8;font-size:13px">Emergency Treatment for Accident Cases Available</p>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:0;padding:24px;border-radius:0 0 8px 8px">
          <p>Dear <strong>${data.patientName}</strong>,</p>
          <p>Your appointment has been confirmed!</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:8px 0;color:#6b7280;width:120px">Service:</td><td style="padding:8px 0;font-weight:600">${data.serviceName}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Doctor:</td><td style="padding:8px 0;font-weight:600">${data.doctorName}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Date:</td><td style="padding:8px 0;font-weight:600">${data.date}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Time:</td><td style="padding:8px 0;font-weight:600">${data.time}</td></tr>
          </table>
          <p style="color:#6b7280;font-size:13px">Please arrive 15 minutes early with your photo ID.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
          <p style="color:#9ca3af;font-size:11px">Dhanvantari Hospital — Emergency Treatment for Accident Cases Available</p>
        </div>
      </div>
    `,
  };
}

export function getContactNotificationEmail(data: {
  name: string; email: string; phone?: string; subject: string; message: string;
}) {
  return {
    to: HOSPITAL_EMAIL,
    subject: `New Contact Form: ${data.subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <h2 style="color:#1e3a5f">New Contact Message — Dhanvantari Hospital</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#6b7280;width:80px">Name:</td><td>${data.name}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Email:</td><td>${data.email}</td></tr>
          ${data.phone ? `<tr><td style="padding:6px 0;color:#6b7280">Phone:</td><td>${data.phone}</td></tr>` : ""}
          <tr><td style="padding:6px 0;color:#6b7280">Subject:</td><td><strong>${data.subject}</strong></td></tr>
        </table>
        <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-top:12px">
          <p style="margin:0;white-space:pre-line">${data.message}</p>
        </div>
      </div>
    `,
  };
}

export function getJobApplicationEmail(data: {
  name: string; email: string; phone: string; jobTitle: string;
}) {
  return {
    subject: `New Job Application: ${data.jobTitle}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <h2 style="color:#1e3a5f">New Job Application</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#6b7280">Position:</td><td><strong>${data.jobTitle}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Name:</td><td>${data.name}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Email:</td><td>${data.email}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Phone:</td><td>${data.phone}</td></tr>
        </table>
      </div>
    `,
  };
}

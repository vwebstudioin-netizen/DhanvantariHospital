import "server-only";
import twilio from "twilio";
import { SITE_NAME } from "@/lib/constants";

function getClient() {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

const FROM = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return `whatsapp:+${digits}`;
  if (digits.length === 10) return `whatsapp:+91${digits}`;
  return `whatsapp:+${digits}`;
}

export async function sendWhatsApp(to: string, message: string): Promise<boolean> {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn("[WhatsApp] Twilio credentials not configured");
    return false;
  }
  try {
    await getClient().messages.create({
      from: FROM,
      to: formatPhone(to),
      body: message,
    });
    return true;
  } catch (err) {
    console.error("[WhatsApp] Send failed:", err);
    return false;
  }
}

export async function sendTokenCalledNotification(
  phone: string,
  tokenNumber: string
): Promise<boolean> {
  const message = `${SITE_NAME}: Your token *#${tokenNumber}* is being called now. Please proceed to the reception counter. Thank you!`;
  return sendWhatsApp(phone, message);
}

export async function sendAppointmentReminder(
  phone: string,
  name: string,
  date: string,
  time: string,
  doctorName?: string
): Promise<boolean> {
  const doctor = doctorName ? ` with ${doctorName}` : "";
  const message = `Hello ${name},\n\nThis is a reminder for your appointment${doctor} at *${SITE_NAME}*.\n\n📅 Date: ${date}\n🕐 Time: ${time}\n\nPlease arrive 10 minutes early. For queries, reply to this message or contact us.\n\nThank you!`;
  return sendWhatsApp(phone, message);
}

export async function sendAdmissionCardDetails(
  phone: string,
  name: string,
  cardNumber: string,
  ward: string,
  roomNumber: string,
  expiryDate: string
): Promise<boolean> {
  const message = `Hello ${name},\n\n*${SITE_NAME}* — In-Patient Card Details:\n\n🏥 Card No: *${cardNumber}*\n🛏 Ward: ${ward}, Room: ${roomNumber}\n📅 Valid until: ${expiryDate}\n\nPlease keep this card for reference during your stay.\n\nGet well soon!`;
  return sendWhatsApp(phone, message);
}

export async function sendFestiveWish(
  phone: string,
  name: string,
  occasion: string,
  message: string
): Promise<boolean> {
  const personalised = message.replace(/{name}/g, name);
  const fullMessage = `*${SITE_NAME}* wishes you:\n\n${personalised}\n\n🎉 Happy ${occasion}!`;
  return sendWhatsApp(phone, fullMessage);
}

export async function sendBulkWishes(
  recipients: { name: string; phone: string }[],
  occasion: string,
  message: string
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const ok = await sendFestiveWish(recipient.phone, recipient.name, occasion, message);
    if (ok) success++;
    else failed++;
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 200));
  }

  return { success, failed };
}

export async function sendReviewRequest(
  phone: string,
  name: string,
  ref: string
): Promise<boolean> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const reviewUrl = `${siteUrl}/reviews/submit?ref=${encodeURIComponent(ref)}&name=${encodeURIComponent(name)}`;
  const message = `Hello ${name},\n\nThank you for visiting *${SITE_NAME}*! 🙏\n\nWe hope you had a great experience. Please take a moment to share your feedback — it helps us serve you better.\n\n⭐ Rate your visit here:\n${reviewUrl}\n\n(It only takes 30 seconds!)\n\nThank you,\n${SITE_NAME}`;
  return sendWhatsApp(phone, message);
}

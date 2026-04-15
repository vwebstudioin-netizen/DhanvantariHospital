/**
 * WhatsApp helpers — static wa.me links with pre-filled messages.
 *
 * Every function builds a https://wa.me/ URL. When opened in a browser
 * or tapped on mobile, WhatsApp launches with the message ready to send —
 * the user just taps Send, no server or API needed.
 *
 * Phone format accepted: 10-digit Indian mobile, or with country code.
 */

import { SITE_NAME } from "@/lib/constants";

// ── Phone normalisation ───────────────────────────────────────────────────────

/** Strip non-digits, ensure leading 91 for Indian numbers. */
export function normalisePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return digits;
  if (digits.length === 10) return `91${digits}`;
  return digits; // already has country code
}

// ── wa.me link builder ────────────────────────────────────────────────────────

/** Build a wa.me URL that opens WhatsApp with a pre-filled message. */
export function buildWaLink(phone: string, message: string): string {
  const number = normalisePhone(phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Open WhatsApp in a new tab with a pre-filled message.
 * Call this directly in onClick handlers.
 */
export function openWhatsApp(phone: string, message: string): void {
  window.open(buildWaLink(phone, message), "_blank", "noopener,noreferrer");
}

// ── Pre-built message templates ───────────────────────────────────────────────

/** Token called: opens WhatsApp on the staff's device pointing to the patient. */
export function buildTokenCalledLink(phone: string, tokenNumber: string): string {
  const message =
    `🏥 *${SITE_NAME}*\n\n` +
    `Your token *#${tokenNumber}* is now being called.\n` +
    `Please proceed to the reception counter.\n\n` +
    `Thank you! 🙏`;
  return buildWaLink(phone, message);
}

/** Appointment reminder link. */
export function buildAppointmentReminderLink(
  phone: string,
  name: string,
  date: string,
  time: string,
  doctorName?: string
): string {
  const doctor = doctorName ? ` with ${doctorName}` : "";
  const message =
    `Hello ${name},\n\n` +
    `This is a reminder for your appointment${doctor} at *${SITE_NAME}*.\n\n` +
    `📅 Date: ${date}\n` +
    `🕐 Time: ${time}\n\n` +
    `Please arrive 10 minutes early. For queries, reply to this message or call us.\n\n` +
    `Thank you!`;
  return buildWaLink(phone, message);
}

/** Admission card details link. */
export function buildAdmissionCardLink(
  phone: string,
  name: string,
  cardNumber: string,
  ward: string,
  roomNumber: string
): string {
  const message =
    `Hello ${name},\n\n` +
    `*${SITE_NAME}* — In-Patient Card Details:\n\n` +
    `🏥 Card No: *${cardNumber}*\n` +
    `🛏 Ward: ${ward}, Room: ${roomNumber}\n\n` +
    `Please keep this for reference during your stay.\n\n` +
    `Get well soon! 💊`;
  return buildWaLink(phone, message);
}

/** Review request link — opens WhatsApp with a pre-filled review request. */
export function buildReviewRequestLink(
  phone: string,
  name: string,
  ref?: string
): string {
  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "https://dhanvantarihospital.com";
  const reviewUrl = `${siteUrl}/reviews/submit${ref ? `?ref=${encodeURIComponent(ref)}&name=${encodeURIComponent(name)}` : ""}`;
  const message =
    `Hello ${name},\n\n` +
    `Thank you for visiting *${SITE_NAME}*! 🙏\n\n` +
    `We hope you had a great experience. Please take a moment to share your feedback — it helps us serve you better and helps other patients too.\n\n` +
    `⭐ Share your review here:\n${reviewUrl}\n\n` +
    `(Takes less than 30 seconds!)\n\n` +
    `Thank you,\n${SITE_NAME} Team`;
  return buildWaLink(phone, message);
}

/** Festive wish link. */
export function buildFestiveWishLink(
  phone: string,
  name: string,
  occasion: string,
  customMessage: string
): string {
  const personalised = customMessage.replace(/{name}/g, name);
  const message =
    `*${SITE_NAME}* wishes you,\n\n` +
    `${personalised}\n\n` +
    `🎉 Happy ${occasion}, ${name}!`;
  return buildWaLink(phone, message);
}

/** Hospital invoice / billing summary link. */
export function buildInvoiceLink(
  phone: string,
  name: string,
  invoiceNo: string,
  amount: string,
  items?: { name: string; amount: number }[]
): string {
  const itemLines = items && items.length
    ? "\n\n*Services:*\n" + items.map((i) => `  • ${i.name} — ₹${i.amount.toLocaleString("en-IN")}`).join("\n")
    : "";
  const message =
    `Hello ${name},\n\n` +
    `Your invoice from *${SITE_NAME}* is ready.\n\n` +
    `🧾 Invoice No: *${invoiceNo}*${itemLines}\n\n` +
    `💰 *Total: ₹${amount}*\n\n` +
    `Please contact the billing counter for payment or queries.\n\n` +
    `Thank you! 🙏`;
  return buildWaLink(phone, message);
}

/** Pharmacy bill summary link — lists each medicine. */
export function buildPharmacyBillLink(
  phone: string,
  name: string,
  billNo: string,
  total: number,
  items: { name: string; quantity: number; unit: string; total: number }[]
): string {
  const itemLines = items
    .map((i) => `  • ${i.name} × ${i.quantity} ${i.unit} — ₹${i.total.toFixed(2)}`)
    .join("\n");
  const message =
    `Hello ${name},\n\n` +
    `Your pharmacy bill from *${SITE_NAME}*:\n\n` +
    `🧾 Bill No: *${billNo}*\n\n` +
    `💊 *Medicines:*\n${itemLines}\n\n` +
    `💰 *Total: ₹${total.toFixed(2)}*\n\n` +
    `Thank you for choosing ${SITE_NAME}! 🙏`;
  return buildWaLink(phone, message);
}

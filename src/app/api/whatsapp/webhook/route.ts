import { NextRequest, NextResponse } from "next/server";
import { sendWhatsApp } from "@/lib/whatsapp";
import { SITE_NAME, CONTACT_PHONE, HOSPITAL_ADDRESS } from "@/lib/constants";

// Twilio sends form-encoded POST to this webhook
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = formData.get("Body")?.toString().trim().toUpperCase() || "";
    const from = formData.get("From")?.toString() || "";
    const phone = from.replace("whatsapp:", "").replace("+91", "").replace("+", "");

    let reply = "";

    if (body === "APPOINTMENT") {
      reply = `Hello! 👋\n\nTo check your appointment details at *${SITE_NAME}*, please visit:\n🌐 ${process.env.NEXT_PUBLIC_SITE_URL}/portal\n\nOr call us at 📞 ${CONTACT_PHONE}\n\nWe look forward to serving you!`;
    } else if (body === "CARD") {
      reply = `To check your in-patient card details, please contact our reception:\n📞 ${CONTACT_PHONE}\n\nOr visit us at:\n📍 ${HOSPITAL_ADDRESS}`;
    } else if (body === "STATUS" || body === "QUEUE") {
      reply = `Check your queue status online:\n🌐 ${process.env.NEXT_PUBLIC_SITE_URL}/queue\n\nYou can search by your token number or phone number.`;
    } else if (body === "HELP") {
      reply = `*${SITE_NAME} — WhatsApp Bot*\n\nReply with:\n• *APPOINTMENT* — Appointment info\n• *CARD* — In-patient card\n• *STATUS* — Queue status\n• *HELP* — Show this menu\n\nFor urgent help call: 📞 ${CONTACT_PHONE}`;
    } else {
      reply = `Welcome to *${SITE_NAME}*! 🏥\n\nReply with *HELP* to see available options.\n\nFor immediate assistance: 📞 ${CONTACT_PHONE}\n📍 ${HOSPITAL_ADDRESS}`;
    }

    // Send reply back via WhatsApp
    if (phone && reply) {
      await sendWhatsApp(phone, reply);
    }

    // Twilio expects 200 with TwiML or empty response
    return new NextResponse("<?xml version='1.0' encoding='UTF-8'?><Response></Response>", {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err) {
    console.error("[/api/whatsapp/webhook]", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "WhatsApp webhook active" });
}

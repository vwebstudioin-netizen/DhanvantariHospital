import { NextRequest, NextResponse } from "next/server";
import { sendWhatsApp } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const { phone, message } = await req.json();
    if (!phone || !message) {
      return NextResponse.json({ error: "phone and message are required" }, { status: 400 });
    }
    const ok = await sendWhatsApp(phone, message);
    return NextResponse.json({ success: ok });
  } catch (err) {
    console.error("[/api/whatsapp/send]", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

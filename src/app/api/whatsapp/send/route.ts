import { NextRequest, NextResponse } from "next/server";
import { buildWaLink } from "@/lib/whatsapp";

/**
 * POST /api/whatsapp/send
 *
 * No longer sends via Twilio. Returns a wa.me link with a pre-filled message.
 * The client opens the link so the user taps Send themselves.
 */
export async function POST(req: NextRequest) {
  try {
    const { phone, message } = await req.json();
    if (!phone || !message) {
      return NextResponse.json({ error: "phone and message are required" }, { status: 400 });
    }
    const link = buildWaLink(phone, message);
    return NextResponse.json({ success: true, link });
  } catch (err) {
    console.error("[/api/whatsapp/send]", err);
    return NextResponse.json({ error: "Failed to build link" }, { status: 500 });
  }
}

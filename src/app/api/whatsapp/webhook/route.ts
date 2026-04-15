import { NextRequest, NextResponse } from "next/server";
import { SITE_NAME, CONTACT_PHONE, HOSPITAL_ADDRESS } from "@/lib/constants";

/**
 * WhatsApp webhook — kept for future use but Twilio is not active.
 * WhatsApp messages are now sent via wa.me links (no server-side sending).
 */
export async function POST(req: NextRequest) {
  // No Twilio — just acknowledge the request
  return new NextResponse("<?xml version='1.0' encoding='UTF-8'?><Response></Response>", {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}

export async function GET() {
  return NextResponse.json({ status: "WhatsApp webhook endpoint — wa.me mode active" });
}

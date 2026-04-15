import { NextRequest, NextResponse } from "next/server";

/**
 * WhatsApp webhook stub — kept for routing compatibility.
 * Messages are sent via wa.me links opened in the browser (no server-side sending).
 */
export async function POST(req: NextRequest) {
  // Stub — acknowledge any incoming request
  return new NextResponse("<?xml version='1.0' encoding='UTF-8'?><Response></Response>", {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}

export async function GET() {
  return NextResponse.json({ status: "WhatsApp endpoint active — wa.me mode" });
}

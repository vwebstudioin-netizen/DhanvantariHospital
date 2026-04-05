import { NextResponse } from "next/server";

// Razorpay is not used in this project. Payments are handled via UPI with manual verification.
export async function POST() {
  return NextResponse.json(
    { error: "Online payments are handled via UPI. This endpoint is not active." },
    { status: 501 }
  );
}

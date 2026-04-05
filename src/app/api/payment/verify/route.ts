import { NextResponse } from "next/server";

// Razorpay is not used in this project.
export async function POST() {
  return NextResponse.json(
    { error: "Online payment verification is not active. Payments use UPI with manual verification." },
    { status: 501 }
  );
}

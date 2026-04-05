import { NextRequest, NextResponse } from "next/server";
import { addDocument, getDocuments } from "@/lib/firestore";
import { where } from "firebase/firestore";
import { newsletterSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = newsletterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Check if already subscribed
    const existing = await getDocuments("newsletters", [
      where("email", "==", email),
    ]);

    if (existing.length > 0) {
      return NextResponse.json(
        { success: true, message: "Already subscribed" },
        { status: 200 }
      );
    }

    // Add new subscriber
    await addDocument("newsletters", {
      email,
      subscribedAt: new Date().toISOString(),
      isActive: true,
    });

    return NextResponse.json(
      { success: true, message: "Successfully subscribed" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

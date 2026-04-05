import { NextRequest, NextResponse } from "next/server";
import { addDocument } from "@/lib/firestore";
import { reviewFormSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = reviewFormSchema.safeParse({
      rating: body.rating,
      text: body.text,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { rating, text } = result.data;

    // Get optional fields
    const {
      patientName,
      patientEmail,
      doctorSlug,
      departmentSlug,
      serviceSlug,
      userId,
    } = body;

    const reviewId = await addDocument("reviews", {
      rating,
      text,
      patientName: patientName || "Anonymous",
      patientEmail: patientEmail || null,
      doctorSlug: doctorSlug || null,
      departmentSlug: departmentSlug || null,
      serviceSlug: serviceSlug || null,
      userId: userId || null,
      status: "pending", // Requires admin approval
      isPublished: false,
    });

    return NextResponse.json(
      { success: true, reviewId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

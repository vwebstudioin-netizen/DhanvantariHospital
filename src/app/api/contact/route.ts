import { NextRequest, NextResponse } from "next/server";
import { addDocument } from "@/lib/firestore";
import { sendEmail, getContactNotificationEmail } from "@/lib/email";
import { contactFormSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message, locationId } = result.data;

    // Save to Firestore
    const docId = await addDocument("contactMessages", {
      name,
      email,
      phone: phone || null,
      subject,
      message,
      locationId: locationId || null,
      status: "unread",
    });

    // Send notification email to admin (non-blocking)
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    if (adminEmail) {
      const emailData = getContactNotificationEmail({
        name,
        email,
        phone,
        subject,
        message,
      });

      sendEmail({
        to: adminEmail,
        subject: emailData.subject,
        html: emailData.html,
        replyTo: email,
      }).catch((err) =>
        console.error("Failed to send contact notification:", err)
      );
    }

    return NextResponse.json(
      { success: true, id: docId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

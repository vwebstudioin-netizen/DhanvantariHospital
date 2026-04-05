import { NextRequest, NextResponse } from "next/server";
import { addDocument } from "@/lib/firestore";
import { sendEmail, getJobApplicationEmail } from "@/lib/email";
import { jobApplicationSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = jobApplicationSchema.safeParse({
      name: body.name,
      email: body.email,
      phone: body.phone,
      coverLetter: body.coverLetter,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, coverLetter } = result.data;
    const { jobSlug, jobTitle, resumeUrl } = body;

    if (!jobSlug || !jobTitle) {
      return NextResponse.json(
        { error: "Job information is required" },
        { status: 400 }
      );
    }

    // Save application to Firestore
    const applicationId = await addDocument("jobApplications", {
      jobSlug,
      jobTitle,
      name,
      email,
      phone,
      coverLetter: coverLetter || "",
      resumeUrl: resumeUrl || null,
      status: "new",
    });

    // Send notification email to HR (non-blocking)
    const hrEmail = process.env.HR_EMAIL || process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    if (hrEmail) {
      const emailData = getJobApplicationEmail({
        name,
        email,
        phone,
        jobTitle,
      });

      sendEmail({
        to: hrEmail,
        subject: emailData.subject,
        html: emailData.html,
      }).catch((err) =>
        console.error("Failed to send application notification:", err)
      );
    }

    return NextResponse.json(
      { success: true, applicationId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Job application error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

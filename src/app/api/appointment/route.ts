import { NextRequest, NextResponse } from "next/server";
import { addDocument } from "@/lib/firestore";
import { sendEmail, getAppointmentConfirmationEmail } from "@/lib/email";
import { bookingPatientSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate patient info portion
    const patientResult = bookingPatientSchema.safeParse({
      patientName: body.patientName,
      patientEmail: body.patientEmail,
      patientPhone: body.patientPhone,
      patientDOB: body.patientDOB,
      isNewPatient: body.isNewPatient ?? true,
      notes: body.notes,
    });

    if (!patientResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: patientResult.error.flatten() },
        { status: 400 }
      );
    }

    // Ensure required booking fields
    const {
      departmentSlug,
      serviceSlug,
      doctorSlug,
      locationSlug,
      date,
      time,
      type,
      patientName,
      patientEmail,
      patientPhone,
      patientDOB,
      isNewPatient,
      notes,
      insurancePlan,
      memberId,
      groupNumber,
    } = body;

    if (!departmentSlug || !date || !time || !locationSlug) {
      return NextResponse.json(
        { error: "Missing required booking fields" },
        { status: 400 }
      );
    }

    // Save to contactMessages so it appears in the desk Messages inbox
    // type: "appointment" distinguishes it from contact form messages
    const appointmentId = await addDocument("contactMessages", {
      messageType: "appointment",
      name: patientName,
      email: patientEmail,
      phone: patientPhone,
      subject: `Appointment Request — ${departmentSlug?.replace(/-/g, " ") || "General"}`,
      message: `Date: ${date} at ${time}\nDepartment: ${departmentSlug || "—"}\nService: ${serviceSlug || "—"}\nDoctor: ${doctorSlug || "Any"}\nNew Patient: ${isNewPatient ? "Yes" : "No"}\nNotes: ${notes || "None"}`,
      // Extra appointment fields for display
      date,
      time,
      departmentSlug: departmentSlug || null,
      serviceSlug: serviceSlug || null,
      doctorSlug: doctorSlug || null,
      isNewPatient: isNewPatient ?? true,
      insurancePlan: insurancePlan || null,
      isRead: false,
      status: "pending",
    });

    // Send confirmation email (non-blocking)
    const emailData = getAppointmentConfirmationEmail({
      patientName,
      serviceName: serviceSlug || "General Consultation",
      doctorName: doctorSlug || "Assigned Doctor",
      date,
      time,
      locationName: locationSlug || "Main Location",
      type: type || "in-person",
    });

    sendEmail({
      to: patientEmail,
      subject: emailData.subject,
      html: emailData.html,
    }).catch((err) => console.error("Failed to send confirmation email:", err));

    return NextResponse.json(
      { success: true, appointmentId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Appointment creation error:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    if (!adminAuth) {
      return NextResponse.json(
        { error: "Firebase Admin not configured." },
        { status: 503 }
      );
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    if (!decodedToken.admin) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { uid, role } = body;

    if (!uid || !role) {
      return NextResponse.json(
        { error: "Both uid and role are required" },
        { status: 400 }
      );
    }

    const validRoles = ["admin", "pharmacist", "receptionist", "doctor", "patient"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(", ")}` },
        { status: 400 }
      );
    }

    const claims: Record<string, boolean> = {};

    switch (role) {
      case "admin":
        claims.admin = true;
        break;
      case "pharmacist":
        claims.pharmacist = true;
        break;
      case "receptionist":
        claims.receptionist = true;
        break;
      case "doctor":
        claims.doctor = true;
        break;
      case "patient":
        claims.patient = true;
        break;
    }

    await adminAuth.setCustomUserClaims(uid, claims);
    const userRecord = await adminAuth.getUser(uid);

    return NextResponse.json({ success: true, uid, role, email: userRecord.email, claims });
  } catch (error) {
    console.error("Set role error:", error);
    return NextResponse.json({ error: "Failed to set user role" }, { status: 500 });
  }
}

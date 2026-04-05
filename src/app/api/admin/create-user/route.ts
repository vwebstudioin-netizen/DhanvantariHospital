import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    if (!adminAuth) {
      return NextResponse.json({ error: "Firebase Admin not configured." }, { status: 503 });
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    if (!decodedToken.admin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { email, password, displayName, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: "email, password and role are required" }, { status: 400 });
    }

    const validRoles = ["admin", "pharmacist", "receptionist", "doctor"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: `Invalid role. Must be one of: ${validRoles.join(", ")}` }, { status: 400 });
    }

    // Create user
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: displayName || undefined,
    });

    // Set role claim
    const claims: Record<string, boolean> = {};
    claims[role] = true;
    await adminAuth.setCustomUserClaims(userRecord.uid, claims);

    return NextResponse.json({
      success: true,
      uid: userRecord.uid,
      email: userRecord.email,
      role,
    });
  } catch (error: any) {
    console.error("Create user error:", error);
    const message = error.code === "auth/email-already-exists"
      ? "A user with this email already exists"
      : error.message || "Failed to create user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

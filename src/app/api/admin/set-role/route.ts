import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

const VALID_ROLES = ["admin", "pharmacist", "receptionist", "doctor", "patient"] as const;

async function getCallerRole(uid: string): Promise<string | null> {
  const snap = await getDoc(doc(db, "userRoles", uid));
  return snap.exists() ? (snap.data().role ?? null) : null;
}

export async function POST(request: NextRequest) {
  try {
    const { callerUid, uid, role, email, displayName } = await request.json();

    if (!callerUid || !uid || !role) {
      return NextResponse.json({ error: "callerUid, uid and role are required" }, { status: 400 });
    }

    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}` },
        { status: 400 }
      );
    }

    // Verify caller is admin
    const callerRole = await getCallerRole(callerUid);
    if (callerRole !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // Write role to Firestore
    await setDoc(doc(db, "userRoles", uid), {
      role,
      email: email || "",
      displayName: displayName || "",
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({ success: true, uid, role });
  } catch (error) {
    console.error("Set role error:", error);
    return NextResponse.json({ error: "Failed to set role" }, { status: 500 });
  }
}

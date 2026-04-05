/**
 * Creates a new Firebase Auth user + writes their role to Firestore.
 * No Firebase Admin SDK needed — uses the REST API with an API key.
 * Protected by checking caller's role in Firestore.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

const VALID_ROLES = ["admin", "pharmacist", "receptionist", "doctor"] as const;

async function getCallerRole(uid: string): Promise<string | null> {
  const snap = await getDoc(doc(db, "userRoles", uid));
  return snap.exists() ? (snap.data().role ?? null) : null;
}

async function createFirebaseUser(
  email: string,
  password: string,
  displayName?: string
): Promise<{ uid: string; email: string }> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName, returnSecureToken: false }),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    const msg = data.error?.message || "Failed to create user";
    throw new Error(
      msg === "EMAIL_EXISTS" ? "A user with this email already exists" : msg
    );
  }
  return { uid: data.localId, email: data.email };
}

export async function POST(request: NextRequest) {
  try {
    const { callerUid, email, password, displayName, role } = await request.json();

    if (!callerUid || !email || !password || !role) {
      return NextResponse.json(
        { error: "callerUid, email, password and role are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
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

    // Create Firebase Auth user via REST API
    const { uid, email: createdEmail } = await createFirebaseUser(email, password, displayName);

    // Write role to Firestore
    await setDoc(doc(db, "userRoles", uid), {
      role,
      email: createdEmail,
      displayName: displayName || "",
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({ success: true, uid, email: createdEmail, role });
  } catch (error: any) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 500 });
  }
}

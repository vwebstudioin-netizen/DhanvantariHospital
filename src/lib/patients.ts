import {
  doc, getDoc, setDoc, updateDoc, deleteDoc, collection,
  query, where, getDocs, limit, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User } from "firebase/auth";

export interface PatientRecord {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
  emergencyContact?: string;
  source?: "portal" | "manual" | "seed" | "token" | "card";
  visitCount?: number;
  createdAt: Timestamp;
  lastLoginAt?: Timestamp;
  lastSeen?: Timestamp;
}

/**
 * Called on every Google Sign-In.
 * Creates a new patient record on first login, updates lastLoginAt on subsequent ones.
 */
export async function upsertPatientFromGoogle(user: User): Promise<void> {
  const ref = doc(db, "patients", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      phone: user.phoneNumber || "",
      source: "portal",
      visitCount: 0,
      createdAt: Timestamp.now(),
      lastLoginAt: Timestamp.now(),
    });
  } else {
    await updateDoc(ref, {
      name: user.displayName || snap.data().name,
      email: user.email || snap.data().email,
      photoURL: user.photoURL || snap.data().photoURL,
      lastLoginAt: Timestamp.now(),
    });
  }
}

/**
 * Auto-creates a patient record from a phone number (used by token queue and card creation).
 * Checks by phone first — if already exists, increments visitCount.
 * If not, creates a new minimal record.
 */
export async function upsertPatientByPhone(
  name: string,
  phone: string,
  source: "token" | "card" = "token"
): Promise<void> {
  if (!phone || phone.trim() === "") return; // no phone = skip

  try {
    // Check if patient with this phone already exists
    const q = query(collection(db, "patients"), where("phone", "==", phone.trim()), limit(1));
    const snap = await getDocs(q);

    if (!snap.empty) {
      // Patient exists — update name if blank, increment visitCount, update lastSeen
      const existing = snap.docs[0];
      const data = existing.data();
      await updateDoc(doc(db, "patients", existing.id), {
        ...((!data.name || data.name === "") && { name }),
        visitCount: (data.visitCount || 0) + 1,
        lastSeen: Timestamp.now(),
      });
    } else {
      // New patient — create minimal record
      await setDoc(doc(collection(db, "patients")), {
        uid: "",
        name: name.trim(),
        email: "",
        phone: phone.trim(),
        source,
        visitCount: 1,
        createdAt: Timestamp.now(),
        lastSeen: Timestamp.now(),
      });
    }
  } catch (err) {
    // Don't block the main operation if patient upsert fails
    console.warn("[patients] upsertPatientByPhone failed:", err);
  }
}

/**
 * Called after Google sign-in when patient provides their phone number.
 * If a token/card-created record exists with the same phone (uid = ""),
 * merges it with the Google-authenticated record and deletes the duplicate.
 * Otherwise just updates the portal record with the phone.
 */
export async function linkPatientPhone(uid: string, phone: string): Promise<void> {
  const cleanPhone = phone.trim();

  // Look for an existing phone-based record (created via token/card, uid = "")
  const q = query(collection(db, "patients"), where("phone", "==", cleanPhone), limit(2));
  const snap = await getDocs(q);

  // Find the phantom record (created by token/card, not this portal user)
  const phantom = snap.docs.find(d => d.id !== uid && d.data().uid === "");

  if (phantom) {
    // Get the portal record's data
    const portalSnap = await getDoc(doc(db, "patients", uid));
    const portalData = portalSnap.data() ?? {};

    // Merge: update the phone-based record with Google auth details
    await updateDoc(phantom.ref, {
      uid,
      email:      portalData.email     || "",
      name:       portalData.name      || phantom.data().name,
      photoURL:   portalData.photoURL  || "",
      source:     "portal",
      phone:      cleanPhone,
      lastLoginAt: Timestamp.now(),
    });

    // Delete the now-duplicate portal record (no phone)
    await deleteDoc(doc(db, "patients", uid));
  } else {
    // No phantom record — just save phone to the portal record
    await updateDoc(doc(db, "patients", uid), { phone: cleanPhone });
  }
}

export async function getPatient(uid: string): Promise<PatientRecord | null> {
  const snap = await getDoc(doc(db, "patients", uid));
  if (!snap.exists()) return null;
  return { uid, ...snap.data() } as PatientRecord;
}

export async function updatePatient(
  uid: string,
  data: Partial<Omit<PatientRecord, "uid" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db, "patients", uid), data);
}

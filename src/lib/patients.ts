import {
  doc, getDoc, setDoc, updateDoc, collection,
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

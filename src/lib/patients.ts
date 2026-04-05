import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
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
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

/**
 * Called on every Google Sign-In.
 * Creates a new patient record on first login, updates lastLoginAt on subsequent ones.
 */
export async function upsertPatientFromGoogle(user: User): Promise<void> {
  const ref = doc(db, "patients", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // First login — create full patient record
    await setDoc(ref, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      phone: user.phoneNumber || "",
      createdAt: Timestamp.now(),
      lastLoginAt: Timestamp.now(),
    });
  } else {
    // Returning patient — update last login and sync Google profile
    await updateDoc(ref, {
      name: user.displayName || snap.data().name,
      email: user.email || snap.data().email,
      photoURL: user.photoURL || snap.data().photoURL,
      lastLoginAt: Timestamp.now(),
    });
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

/**
 * Firestore-based role management — replaces Firebase Admin SDK custom claims.
 * Roles are stored in /userRoles/{uid} so no service account key is needed.
 */
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type UserRole = "admin" | "pharmacist" | "receptionist" | "doctor" | "patient";

export interface UserRoleDoc {
  role: UserRole;
  email: string;
  displayName?: string;
  updatedAt: Timestamp;
}

export async function getUserRole(uid: string): Promise<UserRole | null> {
  const snap = await getDoc(doc(db, "userRoles", uid));
  if (!snap.exists()) return null;
  return (snap.data() as UserRoleDoc).role ?? null;
}

export async function setUserRole(
  uid: string,
  role: UserRole,
  email: string,
  displayName?: string
): Promise<void> {
  await setDoc(doc(db, "userRoles", uid), {
    role,
    email,
    displayName: displayName || "",
    updatedAt: Timestamp.now(),
  });
}

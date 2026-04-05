import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

export async function getIdTokenResult() {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdTokenResult();
}

export async function isUserAdmin(): Promise<boolean> {
  const result = await getIdTokenResult();
  return result?.claims?.admin === true;
}

export async function isUserPharmacist(): Promise<boolean> {
  const result = await getIdTokenResult();
  return result?.claims?.pharmacist === true;
}

export async function isUserReceptionist(): Promise<boolean> {
  const result = await getIdTokenResult();
  return result?.claims?.receptionist === true;
}

export async function isUserStaff(): Promise<boolean> {
  const result = await getIdTokenResult();
  return (
    result?.claims?.admin === true ||
    result?.claims?.receptionist === true ||
    result?.claims?.pharmacist === true
  );
}

export async function getUserRole(): Promise<string | null> {
  const result = await getIdTokenResult();
  if (!result) return null;
  if (result.claims.admin) return "admin";
  if (result.claims.pharmacist) return "pharmacist";
  if (result.claims.receptionist) return "receptionist";
  if (result.claims.doctor) return "doctor";
  if (result.claims.patient) return "patient";
  return null;
}

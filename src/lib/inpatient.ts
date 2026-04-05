import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  runTransaction,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { InPatientCard } from "@/types/inpatient";
import { addDays, format } from "date-fns";

const CARDS = "inpatientCards";
const COUNTERS = "counters";

function generatePatientId(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PAT-${rand}`;
}

export async function createInPatientCard(
  data: Omit<InPatientCard, "id" | "cardNumber" | "patientId" | "expiryDate" | "isActive" | "createdAt" | "updatedAt">
): Promise<{ id: string; cardNumber: string; patientId: string }> {
  const counterRef = doc(db, COUNTERS, "inpatientCards");
  let cardNumber = "IPD-0001";

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(counterRef);
    let count = 1;
    if (snap.exists()) {
      count = (snap.data().lastNumber || 0) + 1;
      transaction.update(counterRef, { lastNumber: count });
    } else {
      transaction.set(counterRef, { lastNumber: 1 });
    }
    cardNumber = `IPD-${String(count).padStart(4, "0")}`;
  });

  const admissionDate = data.admissionDate || format(new Date(), "yyyy-MM-dd");
  const expiryDate = format(addDays(new Date(admissionDate), 14), "yyyy-MM-dd");
  const patientId = generatePatientId();
  const now = Timestamp.now();

  const docRef = await addDoc(collection(db, CARDS), {
    ...data,
    cardNumber,
    patientId,
    admissionDate,
    expiryDate,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  return { id: docRef.id, cardNumber, patientId };
}

export async function getActiveCards(): Promise<InPatientCard[]> {
  // Filter client-side to avoid needing a composite Firestore index
  const q = query(collection(db, CARDS), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as InPatientCard)
    .filter((c) => c.isActive === true);
}

export async function getAllCards(): Promise<InPatientCard[]> {
  const q = query(collection(db, CARDS), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as InPatientCard[];
}

export async function getCardByPatientId(patientId: string): Promise<InPatientCard | null> {
  const q = query(collection(db, CARDS), where("patientId", "==", patientId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as InPatientCard;
}

export async function dischargePatient(cardId: string): Promise<void> {
  await updateDoc(doc(db, CARDS, cardId), {
    isActive: false,
    dischargedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

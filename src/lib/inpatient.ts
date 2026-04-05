import {
  collection, addDoc, getDocs, getDoc, doc,
  updateDoc, query, where, orderBy, Timestamp, runTransaction, setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { InPatientCard, CardType } from "@/types/inpatient";
import { addDays, format } from "date-fns";

const CARDS = "inpatientCards";
const COUNTERS = "counters";

function generatePatientId(): string {
  return `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function createInPatientCard(
  data: Omit<InPatientCard, "id" | "cardNumber" | "patientId" | "isActive" | "createdAt" | "updatedAt">
): Promise<{ id: string; cardNumber: string; patientId: string }> {
  const type: CardType = data.type || "room";

  // Separate counters for room vs visit cards
  const counterKey = type === "visit" ? "visitCards" : "roomCards";
  const prefix = type === "visit" ? "OPD" : "IPD";

  const counterRef = doc(db, COUNTERS, counterKey);
  let cardNumber = `${prefix}-0001`;

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(counterRef);
    let count = 1;
    if (snap.exists()) {
      count = (snap.data().lastNumber || 0) + 1;
      transaction.update(counterRef, { lastNumber: count });
    } else {
      transaction.set(counterRef, { lastNumber: 1 });
    }
    cardNumber = `${prefix}-${String(count).padStart(4, "0")}`;
  });

  const admissionDate = data.admissionDate || format(new Date(), "yyyy-MM-dd");
  const patientId = generatePatientId();
  const now = Timestamp.now();

  const cardData: Record<string, any> = {
    ...data,
    type,
    cardNumber,
    patientId,
    admissionDate,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  // Visit cards expire in 14 days; room cards have no expiry
  if (type === "visit") {
    cardData.expiryDate = format(addDays(new Date(admissionDate), 14), "yyyy-MM-dd");
  } else {
    delete cardData.expiryDate; // Room cards: no expiry — active until discharged
  }

  const docRef = await addDoc(collection(db, CARDS), cardData);
  return { id: docRef.id, cardNumber, patientId };
}

export async function getActiveCards(type?: CardType): Promise<InPatientCard[]> {
  const q = query(collection(db, CARDS), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as InPatientCard)
    .filter((c) => c.isActive === true && (!type || c.type === type));
}

export async function getAllCards(type?: CardType): Promise<InPatientCard[]> {
  const q = query(collection(db, CARDS), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as InPatientCard)
    .filter((c) => !type || c.type === type);
}

export async function dischargePatient(cardId: string): Promise<void> {
  await updateDoc(doc(db, CARDS, cardId), {
    isActive: false,
    dischargedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

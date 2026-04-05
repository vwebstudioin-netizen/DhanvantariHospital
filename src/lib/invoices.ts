import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  runTransaction,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Invoice } from "@/types/invoice";

const INVOICES = "invoices";
const COUNTERS = "counters";

export async function createInvoice(
  data: Omit<Invoice, "id" | "invoiceNumber" | "createdAt">
): Promise<{ id: string; invoiceNumber: string }> {
  const counterRef = doc(db, COUNTERS, "invoices");
  let invoiceNumber = "INV-0001";

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(counterRef);
    let count = 1;
    if (snap.exists()) {
      count = (snap.data().lastNumber || 0) + 1;
      transaction.update(counterRef, { lastNumber: count });
    } else {
      transaction.set(counterRef, { lastNumber: 1 });
    }
    invoiceNumber = `INV-${String(count).padStart(4, "0")}`;
  });

  const docRef = await addDoc(collection(db, INVOICES), {
    ...data,
    invoiceNumber,
    createdAt: Timestamp.now(),
  });

  return { id: docRef.id, invoiceNumber };
}

export async function getInvoices(dateStr?: string): Promise<Invoice[]> {
  const q = dateStr
    ? query(collection(db, INVOICES), where("date", "==", dateStr), orderBy("createdAt", "desc"))
    : query(collection(db, INVOICES), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Invoice[];
}

export async function getInvoicesByPhone(phone: string): Promise<Invoice[]> {
  const q = query(
    collection(db, INVOICES),
    where("patientPhone", "==", phone),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Invoice[];
}

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Medicine } from "@/types/medicine";

const COL = "medicines";

export async function getMedicines(activeOnly = true): Promise<Medicine[]> {
  // Client-side filter to avoid composite index requirement
  const q = query(collection(db, COL), orderBy("name", "asc"));
  const snap = await getDocs(q);
  const all = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Medicine[];
  return activeOnly ? all.filter((m) => m.isActive !== false) : all;
}

export async function getMedicineById(id: string): Promise<Medicine | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Medicine;
}

export async function getLowStockMedicines(): Promise<Medicine[]> {
  const all = await getMedicines();
  return all.filter((m) => m.currentStock <= m.reorderLevel);
}

export async function addMedicine(data: Omit<Medicine, "id" | "createdAt">): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateMedicine(id: string, data: Partial<Medicine>): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: new Date().toISOString() });
}

export async function updateStock(id: string, newStock: number): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    currentStock: newStock,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteMedicine(id: string): Promise<void> {
  await updateDoc(doc(db, COL, id), { isActive: false, updatedAt: new Date().toISOString() });
}

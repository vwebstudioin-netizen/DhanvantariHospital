import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateStock, getMedicineById } from "@/lib/medicines";
import type { StockMovement, Supplier } from "@/types/stock";

const MOVEMENTS = "stockMovements";
const SUPPLIERS = "suppliers";

export async function addStockIn(
  medicineId: string,
  quantity: number,
  reason: string,
  performedBy: string,
  extras?: { supplierId?: string; invoiceRef?: string; notes?: string }
): Promise<void> {
  const medicine = await getMedicineById(medicineId);
  if (!medicine) throw new Error("Medicine not found");

  const previousStock = medicine.currentStock;
  const newStock = previousStock + quantity;

  await updateStock(medicineId, newStock);
  await addDoc(collection(db, MOVEMENTS), {
    medicineId,
    medicineName: medicine.name,
    type: "in",
    quantity,
    previousStock,
    newStock,
    reason,
    performedBy,
    ...extras,
    createdAt: new Date().toISOString(),
  });
}

export async function dispense(
  medicineId: string,
  quantity: number,
  performedBy: string,
  patient?: { name: string; phone: string }
): Promise<void> {
  const medicine = await getMedicineById(medicineId);
  if (!medicine) throw new Error("Medicine not found");
  if (medicine.currentStock < quantity) throw new Error("Insufficient stock");

  const previousStock = medicine.currentStock;
  const newStock = previousStock - quantity;

  await updateStock(medicineId, newStock);
  await addDoc(collection(db, MOVEMENTS), {
    medicineId,
    medicineName: medicine.name,
    type: "out",
    quantity,
    previousStock,
    newStock,
    reason: "Dispensed",
    patientName: patient?.name,
    patientPhone: patient?.phone,
    performedBy,
    createdAt: new Date().toISOString(),
  });
}

export async function getMovements(medicineId?: string, limitCount = 50): Promise<StockMovement[]> {
  const q = medicineId
    ? query(collection(db, MOVEMENTS), where("medicineId", "==", medicineId), orderBy("createdAt", "desc"), limit(limitCount))
    : query(collection(db, MOVEMENTS), orderBy("createdAt", "desc"), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as StockMovement[];
}

export async function getSuppliers(): Promise<Supplier[]> {
  const q = query(collection(db, SUPPLIERS), orderBy("name", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Supplier[];
}

export async function addSupplier(data: Omit<Supplier, "id" | "createdAt">): Promise<string> {
  const ref = await addDoc(collection(db, SUPPLIERS), { ...data, createdAt: new Date().toISOString() });
  return ref.id;
}

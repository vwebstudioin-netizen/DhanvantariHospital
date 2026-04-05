/**
 * Seed & Reset utilities — for demo purposes only.
 * Seed: adds realistic demo data across all modules.
 * Reset: deletes all transactional data but preserves admin users, medicine catalog, and hospital setup.
 */
import {
  collection, addDoc, getDocs, deleteDoc, doc,
  setDoc, Timestamp, writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format, addDays, subDays } from "date-fns";

const today = format(new Date(), "yyyy-MM-dd");
const now = Timestamp.now();

// ── Collections to DELETE on reset (transactional data) ─────────────────────
const RESET_COLLECTIONS = [
  "patients",
  "appointments",
  "reviews",
  "inpatientCards",
  "invoices",
  "wishCampaigns",
  "stockMovements",
  "contactMessages",
  "newsletters",
];

async function deleteCollection(colName: string) {
  const snap = await getDocs(collection(db, colName));
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

export async function resetDemoData(): Promise<{ deleted: string[] }> {
  const deleted: string[] = [];
  for (const col of RESET_COLLECTIONS) {
    await deleteCollection(col);
    deleted.push(col);
  }
  // Also delete today's queue tokens
  try {
    const tokenSnap = await getDocs(collection(db, `queue/${today}/tokens`));
    const batch = writeBatch(db);
    tokenSnap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    deleted.push(`queue/${today}/tokens`);
  } catch {
    // ignore if not exists
  }
  return { deleted };
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

const PATIENTS = [
  { name: "Ravi Kumar", phone: "9876543210", email: "ravi@example.com", bloodGroup: "O+" },
  { name: "Priya Patel", phone: "9876543211", email: "priya@example.com", bloodGroup: "A+" },
  { name: "Suresh Reddy", phone: "9876543212", email: "suresh@example.com", bloodGroup: "B+" },
  { name: "Anita Sharma", phone: "9876543213", email: "anita@example.com", bloodGroup: "AB+" },
  { name: "Vijay Singh", phone: "9876543214", email: "vijay@example.com", bloodGroup: "O-" },
];

const MEDICINES_SEED = [
  { name: "Paracetamol 500mg", genericName: "Paracetamol", category: "Analgesics", manufacturer: "Sun Pharma", unit: "tablet", unitsPerPack: 10, costPrice: 8, sellingPrice: 12, currentStock: 150, reorderLevel: 50, isActive: true },
  { name: "Amoxicillin 500mg", genericName: "Amoxicillin", category: "Antibiotics", manufacturer: "Cipla", unit: "capsule", unitsPerPack: 10, costPrice: 45, sellingPrice: 60, currentStock: 80, reorderLevel: 30, isActive: true },
  { name: "Omeprazole 20mg", genericName: "Omeprazole", category: "Antacids", manufacturer: "Dr. Reddy's", unit: "capsule", unitsPerPack: 15, costPrice: 20, sellingPrice: 30, currentStock: 200, reorderLevel: 60, isActive: true },
  { name: "Metformin 500mg", genericName: "Metformin", category: "Antidiabetics", manufacturer: "Mankind", unit: "tablet", unitsPerPack: 10, costPrice: 12, sellingPrice: 18, currentStock: 120, reorderLevel: 40, isActive: true },
  { name: "Amlodipine 5mg", genericName: "Amlodipine", category: "Antihypertensives", manufacturer: "Lupin", unit: "tablet", unitsPerPack: 10, costPrice: 25, sellingPrice: 35, currentStock: 8, reorderLevel: 30, isActive: true },
  { name: "Cetirizine 10mg", genericName: "Cetirizine", category: "Antihistamines", manufacturer: "Cipla", unit: "tablet", unitsPerPack: 10, costPrice: 15, sellingPrice: 22, currentStock: 90, reorderLevel: 30, isActive: true },
  { name: "Normal Saline 500ml", genericName: "Sodium Chloride", category: "IV Fluids", manufacturer: "Baxter", unit: "vial", unitsPerPack: 1, costPrice: 45, sellingPrice: 65, currentStock: 30, reorderLevel: 20, isActive: true },
  { name: "Dextrose 5% 500ml", genericName: "Dextrose", category: "IV Fluids", manufacturer: "Fresenius", unit: "vial", unitsPerPack: 1, costPrice: 55, sellingPrice: 80, currentStock: 25, reorderLevel: 15, isActive: true },
];

export async function seedDemoData(): Promise<{ seeded: string[] }> {
  const seeded: string[] = [];

  // 1. Medicines (only if empty)
  const medSnap = await getDocs(collection(db, "medicines"));
  if (medSnap.empty) {
    for (const med of MEDICINES_SEED) {
      await addDoc(collection(db, "medicines"), { ...med, createdAt: now.toDate().toISOString() });
    }
    seeded.push(`medicines (${MEDICINES_SEED.length})`);
  }

  // 2. Patients
  const patientRefs: string[] = [];
  for (const p of PATIENTS) {
    const ref = await addDoc(collection(db, "patients"), {
      ...p, uid: "", visitCount: Math.floor(Math.random() * 5) + 1,
      totalSpent: 0, createdAt: now, lastLogin: now,
    });
    patientRefs.push(ref.id);
    seeded.push(`patient: ${p.name}`);
  }

  // 3. In-Patient Cards (2 active)
  const CARDS = [
    { patientName: "Ravi Kumar", patientPhone: "9876543210", doctorName: "Dr. Ayyapa", ward: "General Ward", roomNumber: "101", diagnosis: "Fracture - Left Femur", cardNumber: "IPD-0001", patientId: "PAT-1001" },
    { patientName: "Priya Patel", patientPhone: "9876543211", doctorName: "Dr. Ayyapa", ward: "Maternity Ward", roomNumber: "205", diagnosis: "Post-delivery care", cardNumber: "IPD-0002", patientId: "PAT-1002" },
  ];
  for (const card of CARDS) {
    const admissionDate = format(subDays(new Date(), 3), "yyyy-MM-dd");
    const expiryDate = format(addDays(new Date(admissionDate), 14), "yyyy-MM-dd");
    await addDoc(collection(db, "inpatientCards"), {
      ...card, admissionDate, expiryDate, isActive: true,
      issuedBy: "Reception", createdAt: now, updatedAt: now,
    });
  }
  seeded.push("inpatientCards (2)");

  // 4. Invoices (3 sample)
  const INVOICES = [
    { invoiceNumber: "INV-0001", patientName: "Ravi Kumar", patientPhone: "9876543210", doctorName: "Dr. Ayyapa", items: [{ name: "Consultation Fee", type: "consultation", quantity: 1, unitPrice: 500, total: 500 }, { name: "X-Ray", type: "lab", quantity: 1, unitPrice: 400, total: 400 }], subtotal: 900, discount: 0, tax: 0, total: 900, paymentMethod: "cash", paymentStatus: "paid" },
    { invoiceNumber: "INV-0002", patientName: "Priya Patel", patientPhone: "9876543211", doctorName: "Dr. Ayyapa", items: [{ name: "Room Charges", type: "room", quantity: 3, unitPrice: 1000, total: 3000 }, { name: "Normal Saline", type: "medicine", quantity: 2, unitPrice: 65, total: 130 }], subtotal: 3130, discount: 130, tax: 0, total: 3000, paymentMethod: "upi", paymentStatus: "paid" },
    { invoiceNumber: "INV-0003", patientName: "Suresh Reddy", patientPhone: "9876543212", items: [{ name: "Consultation Fee", type: "consultation", quantity: 1, unitPrice: 500, total: 500 }, { name: "Blood Test", type: "lab", quantity: 1, unitPrice: 250, total: 250 }], subtotal: 750, discount: 0, tax: 0, total: 750, paymentMethod: "pending", paymentStatus: "pending" },
  ];
  for (const inv of INVOICES) {
    await addDoc(collection(db, "invoices"), { ...inv, issuedBy: "Reception", createdAt: now });
  }
  seeded.push("invoices (3)");

  // 5. Appointments
  const APPOINTMENTS = [
    { patientName: "Vijay Singh", patientPhone: "9876543214", patientEmail: "vijay@example.com", serviceId: "general-consultation", serviceName: "General Consultation", departmentId: "general-medicine", locationId: "main", locationName: "Dhanvantari Hospital", doctorId: "dr-ayyapa", doctorName: "Dr. Ayyapa", date: format(addDays(new Date(), 1), "yyyy-MM-dd"), time: "10:00", duration: 20, type: "in-person", status: "confirmed", isNewPatient: true },
    { patientName: "Anita Sharma", patientPhone: "9876543213", patientEmail: "anita@example.com", serviceId: "gynecology-consultation", serviceName: "Gynecology Consultation", departmentId: "gynecology", locationId: "main", locationName: "Dhanvantari Hospital", doctorId: "gynecologist", doctorName: "Gynecology Specialist", date: format(addDays(new Date(), 2), "yyyy-MM-dd"), time: "11:30", duration: 30, type: "in-person", status: "pending", isNewPatient: false },
    { patientName: "Ravi Kumar", patientPhone: "9876543210", patientEmail: "ravi@example.com", serviceId: "fracture-treatment", serviceName: "Fracture & Accident Injury", departmentId: "orthopedics", locationId: "main", locationName: "Dhanvantari Hospital", doctorId: "orthopedic-surgeon", doctorName: "Orthopedics Specialist", date: today, time: "09:00", duration: 30, type: "in-person", status: "completed", isNewPatient: false },
  ];
  for (const appt of APPOINTMENTS) {
    await addDoc(collection(db, "appointments"), { ...appt, createdAt: now, updatedAt: now });
  }
  seeded.push("appointments (3)");

  // 6. Reviews (approved)
  const REVIEWS = [
    { patientName: "Ravi Kumar", patientPhone: "9876543210", department: "Orthopedics", rating: 5, comment: "Excellent fracture treatment. Dr. Ayyapa is very skilled and the staff was very caring. My recovery was fast!", status: "approved", ref: "INV-0001" },
    { patientName: "Priya Patel", patientPhone: "9876543211", department: "Gynecology", rating: 5, comment: "Very comfortable delivery experience. The nursing staff was amazing and attentive throughout my stay.", status: "approved", ref: "IPD-0002" },
    { patientName: "Suresh Reddy", patientPhone: "9876543212", department: "General Medicine", rating: 4, comment: "Quick consultation and accurate diagnosis. The hospital is clean and well-maintained. Recommended!", status: "pending" },
  ];
  for (const rev of REVIEWS) {
    await addDoc(collection(db, "reviews"), { ...rev, createdAt: now });
  }
  seeded.push("reviews (3)");

  // 7. Queue tokens for today
  const queueConfigRef = doc(db, `queue/${today}/config`, "settings");
  await setDoc(queueConfigRef, {
    date: today, lastTokenNumber: 5, currentServingToken: 3,
    isQueueActive: true, updatedAt: now,
  });
  const TOKENS = [
    { tokenNumber: 1, displayNumber: "001", patientName: "Suresh Reddy", patientPhone: "9876543212", purpose: "General Consultation", status: "completed" },
    { tokenNumber: 2, displayNumber: "002", patientName: "Anita Sharma", patientPhone: "9876543213", purpose: "Gynecology", status: "completed" },
    { tokenNumber: 3, displayNumber: "003", patientName: "Vijay Singh", patientPhone: "9876543214", purpose: "Orthopedics", status: "serving" },
    { tokenNumber: 4, displayNumber: "004", patientName: "Kiran Rao", patientPhone: "9876543215", purpose: "Cardiology", status: "waiting" },
    { tokenNumber: 5, displayNumber: "005", patientName: "Meena Devi", patientPhone: "9876543216", purpose: "General Consultation", status: "waiting" },
  ];
  for (const token of TOKENS) {
    await addDoc(collection(db, `queue/${today}/tokens`), { ...token, issuedAt: now });
  }
  seeded.push("queue tokens (5)");

  return { seeded };
}

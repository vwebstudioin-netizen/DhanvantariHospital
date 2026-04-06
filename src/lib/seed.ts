/**
 * Seed & Reset utilities — demo purposes only.
 * Seed: simulates a full busy day (20 patients, IPD/OPD cards, tokens, invoices, pharmacy bills).
 * Reset: deletes all transactional data, preserves userRoles, medicines, and supplier catalog.
 */
import {
  collection, addDoc, getDocs, deleteDoc, doc,
  setDoc, Timestamp, writeBatch, query, where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format, addDays, subDays } from "date-fns";

const today      = format(new Date(), "yyyy-MM-dd");
const yesterday  = format(subDays(new Date(), 1), "yyyy-MM-dd");
const now        = Timestamp.now();
const ts = (daysAgo = 0, hour = 9) =>
  Timestamp.fromDate(new Date(new Date().setHours(hour, 0, 0, 0) - daysAgo * 86400000));

// ── Collections deleted on reset (all transactional data) ────────────────────
const RESET_COLLECTIONS = [
  "patients", "appointments", "reviews",
  "inpatientCards", "invoices", "pharmacyBills",
  "wishCampaigns", "stockMovements", "contactMessages", "newsletters",
  "billingServices",
];

async function deleteCollection(colName: string) {
  const snap = await getDocs(collection(db, colName));
  if (snap.empty) return;
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
  // Delete queue tokens for today and yesterday
  for (const dateKey of [today, yesterday]) {
    try {
      const tokenSnap = await getDocs(collection(db, `queue/${dateKey}/tokens`));
      if (!tokenSnap.empty) {
        const batch = writeBatch(db);
        tokenSnap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }
    } catch { /* ignore */ }
  }
  // Reset counters
  try {
    await setDoc(doc(db, "counters", "inpatientCards"), { lastNumber: 0 });
    await setDoc(doc(db, "counters", "invoices"),       { lastNumber: 0 });
    await setDoc(doc(db, "counters", "pharmacyBills"),  { lastNumber: 0 });
  } catch { /* ignore */ }
  deleted.push("queue/tokens", "counters");
  return { deleted };
}

// ── Patients (20) ─────────────────────────────────────────────────────────────
const PATIENTS = [
  { name: "Ravi Kumar",       phone: "9876543210", email: "ravi@example.com",   bloodGroup: "O+",  address: "Mysuru" },
  { name: "Priya Patel",      phone: "9876543211", email: "priya@example.com",  bloodGroup: "A+",  address: "Bengaluru" },
  { name: "Suresh Reddy",     phone: "9876543212", email: "suresh@example.com", bloodGroup: "B+",  address: "Mandya" },
  { name: "Anita Sharma",     phone: "9876543213", email: "anita@example.com",  bloodGroup: "AB+", address: "Hassan" },
  { name: "Vijay Singh",      phone: "9876543214", email: "vijay@example.com",  bloodGroup: "O-",  address: "Mysuru" },
  { name: "Kavitha Nair",     phone: "9876543215", email: "kavitha@example.com",bloodGroup: "A-",  address: "Kushalnagar" },
  { name: "Mohan Gowda",      phone: "9876543216", email: "mohan@example.com",  bloodGroup: "B-",  address: "Mysuru" },
  { name: "Rekha Iyer",       phone: "9876543217", email: "rekha@example.com",  bloodGroup: "O+",  address: "Kodagu" },
  { name: "Arun Menon",       phone: "9876543218", email: "arun@example.com",   bloodGroup: "A+",  address: "Shivamogga" },
  { name: "Deepa Rao",        phone: "9876543219", email: "deepa@example.com",  bloodGroup: "AB-", address: "Mysuru" },
  { name: "Santosh Kumar",    phone: "9876543220", email: "santosh@example.com",bloodGroup: "O+",  address: "Mandya" },
  { name: "Lakshmi Devi",     phone: "9876543221", email: "lakshmi@example.com",bloodGroup: "B+",  address: "Mysuru" },
  { name: "Prakash Hegde",    phone: "9876543222", email: "prakash@example.com",bloodGroup: "A+",  address: "Mangaluru" },
  { name: "Sunita Bhat",      phone: "9876543223", email: "sunita@example.com", bloodGroup: "O+",  address: "Mysuru" },
  { name: "Ganesh Naik",      phone: "9876543224", email: "ganesh@example.com", bloodGroup: "B+",  address: "Hunsur" },
  { name: "Meena Devi",       phone: "9876543225", email: "meena@example.com",  bloodGroup: "A-",  address: "Mysuru" },
  { name: "Rajesh Patil",     phone: "9876543226", email: "rajesh@example.com", bloodGroup: "O+",  address: "Belagavi" },
  { name: "Usha Kumari",      phone: "9876543227", email: "usha@example.com",   bloodGroup: "AB+", address: "Mysuru" },
  { name: "Kiran Rao",        phone: "9876543228", email: "kiran@example.com",  bloodGroup: "B-",  address: "Chamrajnagar" },
  { name: "Nalini Shetty",    phone: "9876543229", email: "nalini@example.com", bloodGroup: "O+",  address: "Mysuru" },
];

// ── Medicines (seeded only if collection empty) ────────────────────────────────
const MEDICINES_SEED = [
  { name: "Paracetamol 500mg",   genericName: "Paracetamol",        category: "Analgesics",       manufacturer: "Sun Pharma",    unit: "tablet",  unitsPerPack: 10, costPrice: 8,  sellingPrice: 12,  currentStock: 500, reorderLevel: 100, isActive: true },
  { name: "Amoxicillin 500mg",   genericName: "Amoxicillin",        category: "Antibiotics",      manufacturer: "Cipla",         unit: "capsule", unitsPerPack: 10, costPrice: 45, sellingPrice: 60,  currentStock: 200, reorderLevel: 50,  isActive: true },
  { name: "Omeprazole 20mg",     genericName: "Omeprazole",         category: "Antacids",         manufacturer: "Dr. Reddy's",   unit: "capsule", unitsPerPack: 15, costPrice: 20, sellingPrice: 30,  currentStock: 300, reorderLevel: 60,  isActive: true },
  { name: "Metformin 500mg",     genericName: "Metformin",          category: "Antidiabetics",    manufacturer: "Mankind",       unit: "tablet",  unitsPerPack: 10, costPrice: 12, sellingPrice: 18,  currentStock: 400, reorderLevel: 80,  isActive: true },
  { name: "Amlodipine 5mg",      genericName: "Amlodipine",         category: "Antihypertensives",manufacturer: "Lupin",         unit: "tablet",  unitsPerPack: 10, costPrice: 25, sellingPrice: 35,  currentStock: 8,   reorderLevel: 30,  isActive: true },
  { name: "Cetirizine 10mg",     genericName: "Cetirizine",         category: "Antihistamines",   manufacturer: "Cipla",         unit: "tablet",  unitsPerPack: 10, costPrice: 15, sellingPrice: 22,  currentStock: 180, reorderLevel: 40,  isActive: true },
  { name: "Normal Saline 500ml", genericName: "Sodium Chloride",    category: "IV Fluids",        manufacturer: "Baxter",        unit: "vial",    unitsPerPack: 1,  costPrice: 45, sellingPrice: 65,  currentStock: 60,  reorderLevel: 20,  isActive: true },
  { name: "Dextrose 5% 500ml",   genericName: "Dextrose",           category: "IV Fluids",        manufacturer: "Fresenius",     unit: "vial",    unitsPerPack: 1,  costPrice: 55, sellingPrice: 80,  currentStock: 40,  reorderLevel: 15,  isActive: true },
  { name: "Ibuprofen 400mg",     genericName: "Ibuprofen",          category: "Analgesics",       manufacturer: "Abbott",        unit: "tablet",  unitsPerPack: 10, costPrice: 18, sellingPrice: 28,  currentStock: 250, reorderLevel: 60,  isActive: true },
  { name: "Azithromycin 500mg",  genericName: "Azithromycin",       category: "Antibiotics",      manufacturer: "Cipla",         unit: "tablet",  unitsPerPack: 5,  costPrice: 80, sellingPrice: 110, currentStock: 0,   reorderLevel: 20,  isActive: true },
];

// ── Seed ──────────────────────────────────────────────────────────────────────
export async function seedDemoData(): Promise<{ seeded: string[] }> {
  const seeded: string[] = [];

  // 1. Medicines (only if empty)
  const medSnap = await getDocs(collection(db, "medicines"));
  if (medSnap.empty) {
    for (const med of MEDICINES_SEED) {
      await addDoc(collection(db, "medicines"), { ...med, createdAt: now });
    }
    seeded.push(`medicines (${MEDICINES_SEED.length})`);
  }

  // 2. Patients (20)
  const patPhoneMap: Record<string, string> = {}; // phone → doc id
  for (let i = 0; i < PATIENTS.length; i++) {
    const p = PATIENTS[i];
    const ref = await addDoc(collection(db, "patients"), {
      ...p, uid: "", source: i < 5 ? "manual" : "token",
      visitCount: Math.floor(Math.random() * 8) + 1,
      totalSpent: 0, createdAt: ts(Math.floor(Math.random() * 30)),
    });
    patPhoneMap[p.phone] = ref.id;
  }
  seeded.push(`patients (${PATIENTS.length})`);

  // 3. In-Patient Cards — 4 IPD Room + 2 OPD Visit
  const CARDS = [
    { type: "room", cardNumber: "IPD-0001", patientId: "PAT-1001", patientName: "Ravi Kumar",    patientPhone: "9876543210", doctorName: "Dr. Ayyapa",         ward: "General Ward",  roomNumber: "101", bedNumber: "A", diagnosis: "Fracture - Left Femur",      isActive: true,  daysAgo: 5 },
    { type: "room", cardNumber: "IPD-0002", patientId: "PAT-1002", patientName: "Priya Patel",   patientPhone: "9876543211", doctorName: "Dr. Ayyapa",         ward: "Maternity Ward",roomNumber: "205", bedNumber: "B", diagnosis: "Post-delivery care",          isActive: true,  daysAgo: 3 },
    { type: "room", cardNumber: "IPD-0003", patientId: "PAT-1003", patientName: "Mohan Gowda",   patientPhone: "9876543216", doctorName: "Dr. Ayyapa",         ward: "ICU",           roomNumber: "001", bedNumber: "1", diagnosis: "Acute MI — post-surgery",     isActive: true,  daysAgo: 2 },
    { type: "room", cardNumber: "IPD-0004", patientId: "PAT-1004", patientName: "Lakshmi Devi",  patientPhone: "9876543221", doctorName: "Dr. Ayyapa",         ward: "General Ward",  roomNumber: "102", bedNumber: "C", diagnosis: "Typhoid Fever",               isActive: false, daysAgo: 10 },
    { type: "visit",cardNumber: "OPD-0001", patientId: "PAT-2001", patientName: "Suresh Reddy",  patientPhone: "9876543212", doctorName: "Dr. Ayyapa",         ward: "",              roomNumber: "",    bedNumber: "",  diagnosis: "Diabetes follow-up",          isActive: true,  daysAgo: 1 },
    { type: "visit",cardNumber: "OPD-0002", patientId: "PAT-2002", patientName: "Anita Sharma",  patientPhone: "9876543213", doctorName: "Dr. Ayyapa",         ward: "",              roomNumber: "",    bedNumber: "",  diagnosis: "Gynaecology review",          isActive: true,  daysAgo: 0 },
  ];
  for (const card of CARDS) {
    const admissionDate = format(subDays(new Date(), card.daysAgo), "yyyy-MM-dd");
    const expiryDate    = card.type === "visit" ? format(addDays(new Date(admissionDate), 14), "yyyy-MM-dd") : "";
    await addDoc(collection(db, "inpatientCards"), {
      ...card, admissionDate, expiryDate,
      issuedBy: "Reception",
      createdAt: ts(card.daysAgo, 8), updatedAt: ts(card.daysAgo, 8),
    });
  }
  await setDoc(doc(db, "counters", "inpatientCards"), { lastNumber: CARDS.length });
  seeded.push(`inpatientCards (${CARDS.length})`);

  // 4. Hospital Invoices (10)
  const INVOICES = [
    { inv: "INV-0001", pat: "Ravi Kumar",    ph: "9876543210", dr: "Dr. Ayyapa", items: [{ name:"Consultation",type:"consultation",quantity:1,unitPrice:500,total:500},{name:"X-Ray",type:"lab",quantity:2,unitPrice:400,total:800}], sub:1300, disc:0,   tot:1300, pm:"cash",     ps:"paid",    daysAgo:5,hr:9  },
    { inv: "INV-0002", pat: "Priya Patel",   ph: "9876543211", dr: "Dr. Ayyapa", items: [{ name:"Room Charges",type:"room",quantity:3,unitPrice:1500,total:4500},{name:"Normal Saline",type:"medicine",quantity:4,unitPrice:65,total:260}], sub:4760, disc:260, tot:4500, pm:"upi",      ps:"paid",    daysAgo:3,hr:10 },
    { inv: "INV-0003", pat: "Suresh Reddy",  ph: "9876543212", dr: "Dr. Ayyapa", items: [{ name:"Consultation",type:"consultation",quantity:1,unitPrice:500,total:500},{name:"Blood Test",type:"lab",quantity:1,unitPrice:350,total:350}], sub:850,  disc:0,   tot:850,  pm:"pending",  ps:"pending", daysAgo:1,hr:11 },
    { inv: "INV-0004", pat: "Anita Sharma",  ph: "9876543213", dr: "Dr. Ayyapa", items: [{ name:"Gynecology Consult",type:"consultation",quantity:1,unitPrice:800,total:800},{name:"Ultrasound",type:"procedure",quantity:1,unitPrice:1200,total:1200}], sub:2000, disc:200, tot:1800, pm:"card",     ps:"paid",    daysAgo:0,hr:9  },
    { inv: "INV-0005", pat: "Vijay Singh",   ph: "9876543214", dr: "Dr. Ayyapa", items: [{ name:"Ortho Consult",type:"consultation",quantity:1,unitPrice:700,total:700},{name:"Plaster Cast",type:"procedure",quantity:1,unitPrice:500,total:500}], sub:1200, disc:0,   tot:1200, pm:"cash",     ps:"paid",    daysAgo:0,hr:10 },
    { inv: "INV-0006", pat: "Kavitha Nair",  ph: "9876543215", dr: "Dr. Ayyapa", items: [{ name:"Consultation",type:"consultation",quantity:1,unitPrice:500,total:500}], sub:500, disc:0, tot:500, pm:"upi", ps:"paid", daysAgo:0, hr:11 },
    { inv: "INV-0007", pat: "Mohan Gowda",   ph: "9876543216", dr: "Dr. Ayyapa", items: [{ name:"ICU Room Charges",type:"room",quantity:2,unitPrice:3000,total:6000},{name:"Dextrose 5%",type:"medicine",quantity:4,unitPrice:80,total:320},{name:"Cardiac Monitor",type:"procedure",quantity:1,unitPrice:500,total:500}], sub:6820, disc:820, tot:6000, pm:"insurance", ps:"paid", daysAgo:2,hr:8 },
    { inv: "INV-0008", pat: "Rekha Iyer",    ph: "9876543217", dr: "Dr. Ayyapa", items: [{ name:"Consultation",type:"consultation",quantity:1,unitPrice:500,total:500},{name:"CBC Blood Test",type:"lab",quantity:1,unitPrice:400,total:400}], sub:900, disc:0, tot:900, pm:"cash", ps:"paid", daysAgo:0, hr:14 },
    { inv: "INV-0009", pat: "Arun Menon",    ph: "9876543218", dr: "Dr. Ayyapa", items: [{ name:"Consultation",type:"consultation",quantity:1,unitPrice:500,total:500},{name:"ECG",type:"procedure",quantity:1,unitPrice:300,total:300}], sub:800, disc:0, tot:800, pm:"upi", ps:"paid", daysAgo:0, hr:15 },
    { inv: "INV-0010", pat: "Deepa Rao",     ph: "9876543219", dr: "Dr. Ayyapa", items: [{ name:"Pediatrics Consult",type:"consultation",quantity:1,unitPrice:600,total:600}], sub:600, disc:0, tot:600, pm:"pending", ps:"pending", daysAgo:0, hr:16 },
  ];
  for (const inv of INVOICES) {
    await addDoc(collection(db, "invoices"), {
      invoiceNumber: inv.inv, patientName: inv.pat, patientPhone: inv.ph, doctorName: inv.dr,
      items: inv.items, subtotal: inv.sub, discount: inv.disc, tax: 0, total: inv.tot,
      paymentMethod: inv.pm, paymentStatus: inv.ps,
      issuedBy: "Reception", createdAt: ts(inv.daysAgo, inv.hr),
    });
  }
  await setDoc(doc(db, "counters", "invoices"), { lastNumber: INVOICES.length });
  seeded.push(`invoices (${INVOICES.length})`);

  // 5. Pharmacy Bills (8)
  const PHARMA_BILLS = [
    { bill: "PHRM-0001", pat: "Ravi Kumar",    ph: "9876543210", dr: "Dr. Ayyapa", items: [{ name:"Ibuprofen 400mg",quantity:2,unitPrice:28,total:56},{name:"Paracetamol 500mg",quantity:3,unitPrice:12,total:36}], sub:92,  disc:0,  tot:92,  pm:"Cash",    ps:"paid",    daysAgo:5,hr:12 },
    { bill: "PHRM-0002", pat: "Priya Patel",   ph: "9876543211", dr: "Dr. Ayyapa", items: [{ name:"Amoxicillin 500mg",quantity:2,unitPrice:60,total:120},{name:"Omeprazole 20mg",quantity:1,unitPrice:30,total:30}], sub:150, disc:0,  tot:150, pm:"UPI",     ps:"paid",    daysAgo:3,hr:13 },
    { bill: "PHRM-0003", pat: "Suresh Reddy",  ph: "9876543212", dr: "Dr. Ayyapa", items: [{ name:"Metformin 500mg",quantity:3,unitPrice:18,total:54},{name:"Amlodipine 5mg",quantity:2,unitPrice:35,total:70}], sub:124, disc:0,  tot:124, pm:"Cash",    ps:"paid",    daysAgo:1,hr:12 },
    { bill: "PHRM-0004", pat: "Anita Sharma",  ph: "9876543213", dr: "Dr. Ayyapa", items: [{ name:"Cetirizine 10mg",quantity:1,unitPrice:22,total:22},{name:"Paracetamol 500mg",quantity:2,unitPrice:12,total:24}], sub:46,  disc:0,  tot:46,  pm:"UPI",     ps:"paid",    daysAgo:0,hr:10 },
    { bill: "PHRM-0005", pat: "Vijay Singh",   ph: "9876543214", dr: "Dr. Ayyapa", items: [{ name:"Ibuprofen 400mg",quantity:1,unitPrice:28,total:28},{name:"Amoxicillin 500mg",quantity:1,unitPrice:60,total:60}], sub:88,  disc:8,  tot:80,  pm:"Cash",    ps:"paid",    daysAgo:0,hr:11 },
    { bill: "PHRM-0006", pat: "Mohan Gowda",   ph: "9876543216", dr: "Dr. Ayyapa", items: [{ name:"Normal Saline 500ml",quantity:6,unitPrice:65,total:390},{name:"Dextrose 5% 500ml",quantity:4,unitPrice:80,total:320}], sub:710, disc:10, tot:700, pm:"Insurance",ps:"paid",   daysAgo:2,hr:9  },
    { bill: "PHRM-0007", pat: "Kavitha Nair",  ph: "9876543215", dr: "Dr. Ayyapa", items: [{ name:"Paracetamol 500mg",quantity:1,unitPrice:12,total:12}], sub:12,  disc:0,  tot:12,  pm:"Cash",    ps:"paid",    daysAgo:0,hr:12 },
    { bill: "PHRM-0008", pat: "Rekha Iyer",    ph: "9876543217", dr: "Dr. Ayyapa", items: [{ name:"Cetirizine 10mg",quantity:2,unitPrice:22,total:44},{name:"Omeprazole 20mg",quantity:1,unitPrice:30,total:30}], sub:74,  disc:0,  tot:74,  pm:"Pending",  ps:"pending", daysAgo:0,hr:15 },
  ];
  for (const b of PHARMA_BILLS) {
    await addDoc(collection(db, "pharmacyBills"), {
      billNumber: b.bill, patientName: b.pat, patientPhone: b.ph, doctorName: b.dr,
      items: b.items, subtotal: b.sub, discount: b.disc, total: b.tot,
      paymentMethod: b.pm, paymentStatus: b.ps,
      issuedBy: "Pharmacist", createdAt: ts(b.daysAgo, b.hr),
    });
  }
  await setDoc(doc(db, "counters", "pharmacyBills"), { lastNumber: PHARMA_BILLS.length });
  seeded.push(`pharmacyBills (${PHARMA_BILLS.length})`);

  // 6. Appointments (8)
  const APPOINTMENTS = [
    { pat: "Vijay Singh",    ph: "9876543214", email: "vijay@example.com",  dept: "orthopedics",    service: "Fracture & Injury",          dr: "Orthopedics Specialist", date: format(addDays(new Date(),1),"yyyy-MM-dd"), time:"10:00",status:"confirmed" },
    { pat: "Anita Sharma",   ph: "9876543213", email: "anita@example.com",  dept: "gynecology",     service: "Gynecology Consultation",    dr: "Dr. Ayyapa",             date: format(addDays(new Date(),2),"yyyy-MM-dd"), time:"11:30",status:"pending" },
    { pat: "Santosh Kumar",  ph: "9876543220", email: "santosh@example.com",dept: "general-medicine",service:"General Consultation",       dr: "Dr. Ayyapa",             date: format(addDays(new Date(),1),"yyyy-MM-dd"), time:"09:00",status:"confirmed" },
    { pat: "Rekha Iyer",     ph: "9876543217", email: "rekha@example.com",  dept: "cardiology",     service: "Cardiology Consultation",    dr: "Cardiology Specialist",  date: today, time:"09:30",status:"completed" },
    { pat: "Ravi Kumar",     ph: "9876543210", email: "ravi@example.com",   dept: "orthopedics",    service: "Fracture Treatment",         dr: "Orthopedics Specialist", date: today, time:"10:00",status:"completed" },
    { pat: "Suresh Reddy",   ph: "9876543212", email: "suresh@example.com", dept: "general-medicine",service:"Diabetes Management",        dr: "Dr. Ayyapa",             date: today, time:"11:00",status:"arrived" },
    { pat: "Nalini Shetty",  ph: "9876543229", email: "nalini@example.com", dept: "general-medicine",service:"General Consultation",       dr: "Dr. Ayyapa",             date: today, time:"14:00",status:"pending" },
    { pat: "Rajesh Patil",   ph: "9876543226", email: "rajesh@example.com", dept: "neurology",      service: "Neurology Consultation",     dr: "Neurology Specialist",   date: format(addDays(new Date(),3),"yyyy-MM-dd"), time:"10:30",status:"pending" },
  ];
  for (const a of APPOINTMENTS) {
    await addDoc(collection(db, "appointments"), {
      type: "patient", patientName: a.pat, patientPhone: a.ph, patientEmail: a.email,
      departmentSlug: a.dept, serviceSlug: a.service, doctorName: a.dr,
      date: a.date, time: a.time, status: a.status,
      isNewPatient: false, createdAt: ts(1, 10), updatedAt: ts(0, 9),
    });
  }
  seeded.push(`appointments (${APPOINTMENTS.length})`);

  // 7. Reviews (6)
  const REVIEWS = [
    { pat: "Ravi Kumar",    ph: "9876543210", dept: "Orthopedics",      rating: 5, comment: "Excellent fracture treatment. Dr. Ayyapa is very skilled. Fast recovery!", status: "approved" },
    { pat: "Priya Patel",   ph: "9876543211", dept: "Gynecology",       rating: 5, comment: "Very comfortable delivery experience. Nursing staff was exceptional!", status: "approved" },
    { pat: "Anita Sharma",  ph: "9876543213", dept: "General Medicine",  rating: 4, comment: "Quick consultation and accurate diagnosis. Hospital is very clean.", status: "approved" },
    { pat: "Mohan Gowda",   ph: "9876543216", dept: "Critical Care",     rating: 5, comment: "They saved my life. ICU team is highly professional. Forever grateful.", status: "approved" },
    { pat: "Vijay Singh",   ph: "9876543214", dept: "Orthopedics",       rating: 4, comment: "Good treatment. Waiting time a bit long but overall satisfied.", status: "pending" },
    { pat: "Kavitha Nair",  ph: "9876543215", dept: "General Medicine",  rating: 3, comment: "Average experience. Could improve waiting area facilities.", status: "pending" },
  ];
  for (const r of REVIEWS) {
    await addDoc(collection(db, "reviews"), {
      patientName: r.pat, patientPhone: r.ph, department: r.dept,
      rating: r.rating, comment: r.comment, status: r.status,
      createdAt: ts(Math.floor(Math.random() * 5), 18),
    });
  }
  seeded.push(`reviews (${REVIEWS.length})`);

  // 8. Queue tokens for today (20 tokens — full day simulation)
  const QUEUE_TOKENS = [
    { n:  1, name: "Rekha Iyer",     phone: "9876543217", purpose: "Cardiology",           status: "completed" },
    { n:  2, name: "Ravi Kumar",     phone: "9876543210", purpose: "Orthopedics",           status: "completed" },
    { n:  3, name: "Priya Patel",    phone: "9876543211", purpose: "Gynecology",            status: "completed" },
    { n:  4, name: "Mohan Gowda",    phone: "9876543216", purpose: "Critical Care",         status: "completed" },
    { n:  5, name: "Santosh Kumar",  phone: "9876543220", purpose: "General Consultation",  status: "completed" },
    { n:  6, name: "Lakshmi Devi",   phone: "9876543221", purpose: "General Consultation",  status: "completed" },
    { n:  7, name: "Suresh Reddy",   phone: "9876543212", purpose: "Diabetes Management",   status: "completed" },
    { n:  8, name: "Kavitha Nair",   phone: "9876543215", purpose: "General Consultation",  status: "completed" },
    { n:  9, name: "Arun Menon",     phone: "9876543218", purpose: "Cardiology",            status: "completed" },
    { n: 10, name: "Deepa Rao",      phone: "9876543219", purpose: "Pediatrics / Child",    status: "completed" },
    { n: 11, name: "Usha Kumari",    phone: "9876543227", purpose: "General Consultation",  status: "completed" },
    { n: 12, name: "Prakash Hegde",  phone: "9876543222", purpose: "Follow-up",             status: "completed" },
    { n: 13, name: "Ganesh Naik",    phone: "9876543224", purpose: "Orthopedics",           status: "skipped"   },
    { n: 14, name: "Anita Sharma",   phone: "9876543213", purpose: "Gynecology",            status: "completed" },
    { n: 15, name: "Vijay Singh",    phone: "9876543214", purpose: "Orthopedics",           status: "completed" },
    { n: 16, name: "Rajesh Patil",   phone: "9876543226", purpose: "Neurology",             status: "completed" },
    { n: 17, name: "Meena Devi",     phone: "9876543225", purpose: "General Consultation",  status: "serving"   },
    { n: 18, name: "Nalini Shetty",  phone: "9876543229", purpose: "General Consultation",  status: "called"    },
    { n: 19, name: "Kiran Rao",      phone: "9876543228", purpose: "Lab / Tests",           status: "waiting"   },
    { n: 20, name: "Sunita Bhat",    phone: "9876543223", purpose: "Follow-up",             status: "waiting"   },
  ];

  const queueConfigRef = doc(db, `queue/${today}/config`, "settings");
  await setDoc(queueConfigRef, {
    date: today, lastTokenNumber: QUEUE_TOKENS.length,
    currentServingToken: 17, isQueueActive: true, updatedAt: now,
  });
  for (const t of QUEUE_TOKENS) {
    await addDoc(collection(db, `queue/${today}/tokens`), {
      tokenNumber: t.n,
      displayNumber: String(t.n).padStart(3, "0"),
      patientName: t.name,
      patientPhone: t.phone,
      purpose: t.purpose,
      status: t.status,
      issuedAt: ts(0, 8 + Math.floor((t.n - 1) / 4)),
      ...(t.status !== "waiting" ? { calledAt: ts(0, 8 + Math.floor((t.n - 1) / 4) + 1) } : {}),
    });
  }
  seeded.push(`queue tokens today (${QUEUE_TOKENS.length})`);

  // 9. Contact messages (3 enquiries)
  const MESSAGES = [
    { name: "Kiran Rao",    email: "kiran@example.com",  phone: "9876543228", subject: "Appointment Enquiry",        message: "I would like to book an appointment for a general check-up. Please advise on availability.", messageType: "contact" },
    { name: "Sunita Bhat",  email: "sunita@example.com", phone: "9876543223", subject: "Visiting Hours",             message: "What are the visiting hours for ICU patients? My father is admitted in room 001.", messageType: "contact" },
    { name: "Rajesh Patil", email: "rajesh@example.com", phone: "9876543226", subject: "Neurology appointment enquiry", message: "Want to consult for persistent headaches. Is neurology available on weekends?", messageType: "appointment" },
  ];
  for (const m of MESSAGES) {
    await addDoc(collection(db, "contactMessages"), { ...m, status: "new", createdAt: ts(0, 10) });
  }
  seeded.push(`contactMessages (${MESSAGES.length})`);

  // 10. Billing Services quick-add items (only if empty)
  const bsSnap = await getDocs(collection(db, "billingServices"));
  if (bsSnap.empty) {
    const BILLING_SERVICES = [
      { name: "Consultation Fee",       type: "consultation", price: 500,  isActive: true },
      { name: "Follow-up Visit",        type: "consultation", price: 300,  isActive: true },
      { name: "Blood Test (CBC)",       type: "lab",          price: 350,  isActive: true },
      { name: "X-Ray",                  type: "lab",          price: 400,  isActive: true },
      { name: "Ultrasound",             type: "procedure",    price: 1200, isActive: true },
      { name: "Room Charges (per day)", type: "room",         price: 1000, isActive: true },
      { name: "ICU Charges (per day)",  type: "room",         price: 3000, isActive: true },
      { name: "Dressing",               type: "procedure",    price: 150,  isActive: true },
      { name: "IV Fluids",              type: "medicine",     price: 200,  isActive: true },
      { name: "ECG",                    type: "procedure",    price: 300,  isActive: true },
    ];
    for (const bs of BILLING_SERVICES) {
      await addDoc(collection(db, "billingServices"), { ...bs, createdAt: now });
    }
    seeded.push(`billingServices (${BILLING_SERVICES.length})`);
  }

  return { seeded };
}

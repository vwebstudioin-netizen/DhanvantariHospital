export type MedicineUnit =
  | "tablet"
  | "capsule"
  | "ml"
  | "mg"
  | "vial"
  | "strip"
  | "sachet"
  | "syrup"
  | "cream"
  | "drops";

export interface Medicine {
  id: string;
  name: string;               // Brand name
  genericName: string;        // Generic/INN name
  category: string;           // Antibiotics, Analgesics, Antacids, etc.
  manufacturer: string;
  unit: MedicineUnit;
  unitsPerPack: number;       // e.g., 10 tablets/strip
  costPrice: number;
  sellingPrice: number;
  currentStock: number;       // in units
  reorderLevel: number;       // alert when stock < this
  expiryDate?: string;        // batch expiry
  batchNumber?: string;
  supplierId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export const MEDICINE_CATEGORIES = [
  "Analgesics",
  "Antibiotics",
  "Antacids",
  "Antihistamines",
  "Antidiabetics",
  "Antihypertensives",
  "Antivirals",
  "Vitamins & Supplements",
  "Dermatology",
  "Ophthalmology",
  "ENT",
  "Respiratory",
  "Cardiac",
  "Neurology",
  "Orthopedic",
  "Gastrointestinal",
  "IV Fluids",
  "Surgical Supplies",
  "Other",
] as const;

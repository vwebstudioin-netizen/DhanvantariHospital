export type MovementType = "in" | "out" | "adjustment" | "expired";

export interface StockMovement {
  id: string;
  medicineId: string;
  medicineName: string;
  type: MovementType;
  quantity: number;           // units moved (positive)
  previousStock: number;
  newStock: number;
  reason: string;             // Purchase, Dispensed, Expired, Manual Adjustment
  patientName?: string;       // If dispensed
  patientPhone?: string;
  supplierId?: string;        // If purchase
  invoiceRef?: string;        // Supplier invoice number
  performedBy: string;
  notes?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  phone: string;
  email?: string;
  gstNumber?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
}

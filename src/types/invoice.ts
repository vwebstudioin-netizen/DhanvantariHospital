import type { Timestamp } from "firebase/firestore";

export type InvoiceItemType =
  | "consultation"
  | "procedure"
  | "medicine"
  | "room"
  | "lab"
  | "other";

export interface InvoiceItem {
  name: string;
  type: InvoiceItemType;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type InvoicePaymentMethod =
  | "cash"
  | "upi"
  | "card"
  | "insurance"
  | "pending";

export type InvoicePaymentStatus = "paid" | "pending" | "partial";

export interface Invoice {
  id: string;
  invoiceNumber: string;    // INV-0001, INV-0002...
  patientName: string;
  patientPhone: string;
  patientId?: string;       // linked to InPatientCard.patientId
  doctorName?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  discountType?: "flat" | "percentage";
  tax: number;
  total: number;
  paymentMethod: InvoicePaymentMethod;
  paymentStatus: InvoicePaymentStatus;
  amountPaid?: number;
  notes?: string;
  issuedBy: string;
  createdAt: Timestamp;
}

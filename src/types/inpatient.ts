import type { Timestamp } from "firebase/firestore";

export type CardType = "room" | "visit";

export interface InPatientCard {
  id: string;
  type: CardType;              // "room" = admitted in-patient | "visit" = OPD visit card
  cardNumber: string;          // IPD-0001 (room) or OPD-0001 (visit)
  patientId: string;           // PAT-XXXX auto-generated
  patientName: string;
  patientPhone?: string;      // Optional — required for WhatsApp notifications
  doctorName: string;

  // Room card specific
  ward?: string;               // General Ward, ICU, Private Room, etc.
  roomNumber?: string;
  bedNumber?: string;

  // Visit card specific
  expiryDate?: string;         // admissionDate + 14 days (visit cards only)

  admissionDate: string;       // ISO date — admission or visit date
  diagnosis: string;
  notes?: string;
  isActive: boolean;           // false when discharged (room) or expired/closed (visit)
  dischargedAt?: Timestamp;
  issuedBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

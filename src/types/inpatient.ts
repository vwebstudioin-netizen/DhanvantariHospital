import type { Timestamp } from "firebase/firestore";

export interface InPatientCard {
  id: string;
  cardNumber: string;       // IPD-0001, IPD-0002...
  patientId: string;        // PAT-XXXX auto-generated
  patientName: string;
  patientPhone: string;
  doctorName: string;
  ward: string;             // General Ward, ICU, Private Room, etc.
  roomNumber: string;
  admissionDate: string;    // ISO date string
  expiryDate: string;       // admissionDate + 14 days
  diagnosis: string;
  notes?: string;
  isActive: boolean;        // false when discharged
  dischargedAt?: Timestamp;
  issuedBy: string;         // desk staff name
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

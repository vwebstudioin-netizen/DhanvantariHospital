import { Timestamp } from "firebase/firestore";

export interface Appointment {
  id: string;
  patientId?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientDOB?: string;
  isNewPatient: boolean;
  serviceId: string;
  serviceName: string;
  departmentId: string;
  locationId: string;
  locationName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  duration: number;
  type: "in-person" | "telehealth";
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no-show";
  notes?: string;
  insurancePlan?: string;
  cancellationReason?: string;
  confirmedAt?: Timestamp;
  completedAt?: Timestamp;
  cancelledAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

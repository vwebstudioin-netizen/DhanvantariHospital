import { Timestamp } from "firebase/firestore";

export interface Patient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  insurance?: {
    planId: string;
    planName: string;
    memberId: string;
    groupNumber?: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notificationPrefs: {
    emailAppointmentReminder: boolean;
    emailNewMessage: boolean;
    smsAppointmentReminder: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PatientMessage {
  id: string;
  patientId: string;
  patientName: string;
  subject: string;
  messages: {
    senderId: string;
    senderName: string;
    senderRole: "patient" | "staff";
    text: string;
    sentAt: Timestamp;
  }[];
  isReadByPatient: boolean;
  isReadByStaff: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

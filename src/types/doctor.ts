import { Timestamp } from "firebase/firestore";

export interface Doctor {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  title: string;
  credentials: string;
  specialty: string;
  subspecialties: string[];
  departmentIds: string[];
  locationIds: string[];
  bio: string;
  education: { degree: string; institution: string; year: number }[];
  certifications: string[];
  languages: string[];
  gender: "male" | "female" | "other";
  acceptingNewPatients: boolean;
  offersTelehealth: boolean;
  insuranceAccepted: string[];
  conditionsTreated: string[];
  proceduresPerformed: string[];
  photoUrl: string;
  averageRating: number;
  reviewCount: number;
  isActive: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DoctorSchedule {
  date: string;
  dayOfWeek: number;
  locationId: string;
  isAvailable: boolean;
  slots: {
    time: string;
    duration: number;
    type: "in-person" | "telehealth";
    isBooked: boolean;
  }[];
}

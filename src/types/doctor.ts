import { Timestamp } from "firebase/firestore";

// ── Weekly schedule per day ───────────────────────────────────────────────────

export type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface DaySchedule {
  available: boolean;    // Is doctor available on this day?
  from: string;          // e.g. "09:00"
  to: string;            // e.g. "17:00"
  slotDuration: number;  // minutes, e.g. 20 or 30
  breakFrom?: string;    // e.g. "13:00" (optional lunch break)
  breakTo?: string;      // e.g. "14:00"
}

export type WeeklySchedule = Record<WeekDay, DaySchedule>;

export const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = {
  monday:    { available: true,  from: "09:00", to: "17:00", slotDuration: 20, breakFrom: "13:00", breakTo: "14:00" },
  tuesday:   { available: true,  from: "09:00", to: "17:00", slotDuration: 20, breakFrom: "13:00", breakTo: "14:00" },
  wednesday: { available: true,  from: "09:00", to: "17:00", slotDuration: 20, breakFrom: "13:00", breakTo: "14:00" },
  thursday:  { available: true,  from: "09:00", to: "17:00", slotDuration: 20, breakFrom: "13:00", breakTo: "14:00" },
  friday:    { available: true,  from: "09:00", to: "17:00", slotDuration: 20, breakFrom: "13:00", breakTo: "14:00" },
  saturday:  { available: true,  from: "09:00", to: "13:00", slotDuration: 20 },
  sunday:    { available: false, from: "09:00", to: "13:00", slotDuration: 20 },
};

export const WEEK_DAYS: WeekDay[] = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
];

// ── Doctor (Firestore) ────────────────────────────────────────────────────────

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
  weeklySchedule?: WeeklySchedule;
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

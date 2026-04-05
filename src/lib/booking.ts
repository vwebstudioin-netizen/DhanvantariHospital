import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { DoctorSchedule } from "@/types";

/**
 * Get available slots for a doctor on a specific date at a specific location.
 */
export async function getAvailableSlots(
  doctorId: string,
  date: string,
  locationId: string
): Promise<DoctorSchedule | null> {
  const scheduleRef = collection(db, "doctors", doctorId, "schedule");
  const q = query(
    scheduleRef,
    where("date", "==", date),
    where("locationId", "==", locationId)
  );
  const snap = await getDocs(q);

  if (snap.empty) return null;

  const scheduleData = snap.docs[0].data() as DoctorSchedule;
  return {
    ...scheduleData,
    slots: scheduleData.slots.filter((slot) => !slot.isBooked),
  };
}

/**
 * Get all schedule entries for a doctor within a date range.
 */
export async function getDoctorScheduleRange(
  doctorId: string,
  startDate: string,
  endDate: string
): Promise<DoctorSchedule[]> {
  const scheduleRef = collection(db, "doctors", doctorId, "schedule");
  const q = query(
    scheduleRef,
    where("date", ">=", startDate),
    where("date", "<=", endDate),
    where("isAvailable", "==", true)
  );
  const snap = await getDocs(q);

  return snap.docs.map((d) => d.data() as DoctorSchedule);
}

/**
 * Check if a specific time slot is still available (real-time check).
 */
export async function isSlotAvailable(
  doctorId: string,
  date: string,
  time: string,
  locationId: string
): Promise<boolean> {
  const schedule = await getAvailableSlots(doctorId, date, locationId);
  if (!schedule) return false;
  return schedule.slots.some((slot) => slot.time === time && !slot.isBooked);
}

/**
 * Generate demo slots for a given date (for demo mode when Firestore is empty).
 */
export function generateDemoSlots(date: string): DoctorSchedule {
  const dayOfWeek = new Date(date).getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  if (isWeekend) {
    return {
      date,
      dayOfWeek,
      locationId: "demo",
      isAvailable: false,
      slots: [],
    };
  }

  const slots = [];
  for (let h = 9; h < 17; h++) {
    for (let m = 0; m < 60; m += 30) {
      const isBooked = Math.random() < 0.3;
      slots.push({
        time: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
        duration: 30,
        type: (Math.random() > 0.8 ? "telehealth" : "in-person") as
          | "in-person"
          | "telehealth",
        isBooked,
      });
    }
  }

  return {
    date,
    dayOfWeek,
    locationId: "demo",
    isAvailable: true,
    slots,
  };
}

import type { WeekDay, WeeklySchedule, DaySchedule } from "@/types/doctor";

// ── Day-of-week helpers ───────────────────────────────────────────────────────

/** JS Date.getDay() returns 0 = Sunday … 6 = Saturday. Maps to our WeekDay keys. */
export function dateToWeekDay(date: Date): WeekDay {
  const map: WeekDay[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return map[date.getDay()];
}

// ── Slot generation ───────────────────────────────────────────────────────────

/** Parse "HH:MM" → total minutes from midnight */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Format total minutes from midnight → "HH:MM" */
function fromMinutes(mins: number): string {
  const h = Math.floor(mins / 60).toString().padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** Format "HH:MM" (24h) → "h:MM AM/PM" */
export function formatTime12(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr;
  const period = h < 12 ? "AM" : "PM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${period}`;
}

/**
 * Generate all available time slots for a given DaySchedule.
 * Respects the optional breakFrom/breakTo window.
 * Returns an array of "HH:MM" strings (24-hour format).
 */
export function generateSlotsForDay(day: DaySchedule): string[] {
  if (!day.available) return [];

  const slots: string[] = [];
  const start = toMinutes(day.from);
  const end = toMinutes(day.to);
  const duration = day.slotDuration;
  const breakStart = day.breakFrom ? toMinutes(day.breakFrom) : null;
  const breakEnd = day.breakTo ? toMinutes(day.breakTo) : null;

  for (let t = start; t + duration <= end; t += duration) {
    // skip slots that fall inside the break window
    if (breakStart !== null && breakEnd !== null) {
      const slotEnd = t + duration;
      // Overlap check: slot overlaps with break?
      if (t < breakEnd && slotEnd > breakStart) continue;
    }
    slots.push(fromMinutes(t));
  }

  return slots;
}

/**
 * Get the DaySchedule for a specific JS Date from a WeeklySchedule.
 * Returns null if the doctor has no schedule or the day is unavailable.
 */
export function getDaySchedule(
  schedule: WeeklySchedule | undefined | null,
  date: Date
): DaySchedule | null {
  if (!schedule) return null;
  const day = dateToWeekDay(date);
  const ds = schedule[day];
  if (!ds || !ds.available) return null;
  return ds;
}

/**
 * Generate displayable time slot strings for a given date.
 * Returns [] when doctor is not available on that date.
 */
export function getSlotsForDate(
  schedule: WeeklySchedule | undefined | null,
  date: Date
): string[] {
  const ds = getDaySchedule(schedule, date);
  if (!ds) return [];
  return generateSlotsForDay(ds);
}

/**
 * Remove already-booked times from a slot list.
 * bookedTimes: array of "HH:MM" strings already booked on that date.
 */
export function filterBookedSlots(slots: string[], bookedTimes: string[]): string[] {
  const bookedSet = new Set(bookedTimes);
  return slots.filter((s) => !bookedSet.has(s));
}

/**
 * Human-readable summary of a DaySchedule, e.g.:
 *   "9:00 AM – 1:00 PM & 5:00 PM – 9:00 PM"  (with break)
 *   "10:00 AM – 1:00 PM"  (no break)
 *   "Not available"
 */
export function formatDayScheduleSummary(ds: DaySchedule | null): string {
  if (!ds || !ds.available) return "Not available";
  if (ds.breakFrom && ds.breakTo) {
    return `${formatTime12(ds.from)} – ${formatTime12(ds.breakFrom)} & ${formatTime12(ds.breakTo)} – ${formatTime12(ds.to)}`;
  }
  return `${formatTime12(ds.from)} – ${formatTime12(ds.to)}`;
}

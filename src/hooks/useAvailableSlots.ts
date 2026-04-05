"use client";

import useSWR from "swr";
import { getAvailableSlots } from "@/lib/booking";
import type { DoctorSchedule } from "@/types";

export function useAvailableSlots(
  doctorId: string | null,
  date: string | null,
  locationId: string | null
) {
  const { data, error, isLoading, mutate } = useSWR<DoctorSchedule | null>(
    doctorId && date && locationId
      ? `slots-${doctorId}-${date}-${locationId}`
      : null,
    () =>
      doctorId && date && locationId
        ? getAvailableSlots(doctorId, date, locationId)
        : null
  );

  return {
    schedule: data,
    error,
    isLoading,
    mutate,
  };
}

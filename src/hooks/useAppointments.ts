"use client";

import useSWR from "swr";
import { getDocuments } from "@/lib/firestore";
import { where, orderBy } from "firebase/firestore";
import type { Appointment } from "@/types";
import { useAuth } from "./useAuth";

export function useAppointments(statusFilter?: string) {
  const { user } = useAuth();

  const constraints = user
    ? [
        where("patientId", "==", user.uid),
        orderBy("createdAt", "desc"),
      ]
    : [];

  if (statusFilter && user) {
    constraints.splice(
      1,
      0,
      where("status", "==", statusFilter)
    );
  }

  const { data, error, isLoading, mutate } = useSWR<
    (Appointment & { id: string })[]
  >(
    user ? `appointments-${user.uid}-${statusFilter || "all"}` : null,
    () => (user ? getDocuments<Appointment>("appointments", constraints) : [])
  );

  return {
    appointments: data || [],
    error,
    isLoading,
    mutate,
  };
}

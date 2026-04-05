"use client";

import useSWR from "swr";
import { getDocument, getDocuments } from "@/lib/firestore";
import { where, orderBy } from "firebase/firestore";
import type { Patient, PatientMessage } from "@/types";
import { useAuth } from "./useAuth";

export function usePatient() {
  const { user } = useAuth();

  const {
    data: patient,
    error,
    isLoading,
    mutate,
  } = useSWR<(Patient & { id: string }) | null>(
    user ? `patient-${user.uid}` : null,
    () => (user ? getDocument<Patient>("patients", user.uid) : null)
  );

  const {
    data: messages,
    error: messagesError,
    isLoading: messagesLoading,
    mutate: mutateMessages,
  } = useSWR<(PatientMessage & { id: string })[]>(
    user ? `patient-messages-${user.uid}` : null,
    () =>
      user
        ? getDocuments<PatientMessage>("patientMessages", [
            where("patientId", "==", user.uid),
            orderBy("updatedAt", "desc"),
          ])
        : []
  );

  return {
    patient,
    error,
    isLoading,
    mutate,
    messages: messages || [],
    messagesError,
    messagesLoading,
    mutateMessages,
  };
}

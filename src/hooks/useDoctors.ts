"use client";

import useSWR from "swr";
import { doctors as staticDoctors } from "@/data/doctors";
import type { DoctorData } from "@/types";

export function useDoctors(filters?: {
  departmentSlug?: string;
  locationSlug?: string;
  specialty?: string;
  search?: string;
  acceptingNew?: boolean;
  telehealth?: boolean;
  gender?: string;
  language?: string;
}) {
  const { data, error, isLoading } = useSWR(
    ["doctors", filters],
    () => {
      let result = [...staticDoctors];

      if (filters?.departmentSlug) {
        result = result.filter((d) =>
          d.departmentSlugs.includes(filters.departmentSlug!)
        );
      }
      if (filters?.locationSlug) {
        result = result.filter((d) =>
          d.locationSlugs.includes(filters.locationSlug!)
        );
      }
      if (filters?.specialty) {
        result = result.filter((d) =>
          d.specialty.toLowerCase().includes(filters.specialty!.toLowerCase())
        );
      }
      if (filters?.acceptingNew) {
        result = result.filter((d) => d.acceptingNewPatients);
      }
      if (filters?.telehealth) {
        result = result.filter((d) => d.offersTelehealth);
      }
      if (filters?.gender) {
        result = result.filter((d) => d.gender === filters.gender);
      }
      if (filters?.language) {
        result = result.filter((d) =>
          d.languages.some((l) =>
            l.toLowerCase().includes(filters.language!.toLowerCase())
          )
        );
      }
      if (filters?.search) {
        const term = filters.search.toLowerCase();
        result = result.filter(
          (d) =>
            `${d.firstName} ${d.lastName}`.toLowerCase().includes(term) ||
            d.specialty.toLowerCase().includes(term) ||
            d.conditionsTreated.some((c) => c.toLowerCase().includes(term))
        );
      }

      return result;
    },
    { fallbackData: staticDoctors }
  );

  return {
    doctors: data || [],
    error,
    isLoading,
  };
}

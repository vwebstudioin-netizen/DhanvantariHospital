import type { InsuranceData } from "@/types";

export const insurancePlans: InsuranceData[] = [
  { name: "Aetna", shortName: "Aetna", type: "PPO", locationSlugs: ["main-campus", "downtown-clinic", "northside-center"] },
  { name: "Aetna HMO", shortName: "Aetna HMO", type: "HMO", locationSlugs: ["main-campus", "downtown-clinic"] },
  { name: "Blue Cross Blue Shield PPO", shortName: "BCBS PPO", type: "PPO", locationSlugs: ["main-campus", "downtown-clinic", "northside-center"] },
  { name: "Blue Cross Blue Shield HMO", shortName: "BCBS HMO", type: "HMO", locationSlugs: ["main-campus", "downtown-clinic", "northside-center"] },
  { name: "Cigna", shortName: "Cigna", type: "PPO", locationSlugs: ["main-campus", "downtown-clinic", "northside-center"] },
  { name: "Cigna HMO", shortName: "Cigna HMO", type: "HMO", locationSlugs: ["main-campus"] },
  { name: "UnitedHealthcare", shortName: "UHC", type: "PPO", locationSlugs: ["main-campus", "downtown-clinic", "northside-center"] },
  { name: "UnitedHealthcare HMO", shortName: "UHC HMO", type: "HMO", locationSlugs: ["main-campus", "downtown-clinic"] },
  { name: "Humana", shortName: "Humana", type: "PPO", locationSlugs: ["main-campus", "downtown-clinic"] },
  { name: "Kaiser Permanente", shortName: "Kaiser", type: "HMO", locationSlugs: ["main-campus"] },
  { name: "Medicare Part A", shortName: "Medicare A", type: "Medicare", locationSlugs: ["main-campus", "downtown-clinic", "northside-center"] },
  { name: "Medicare Part B", shortName: "Medicare B", type: "Medicare", locationSlugs: ["main-campus", "downtown-clinic", "northside-center"] },
  { name: "Medicare Advantage", shortName: "Medicare Adv", type: "Medicare", locationSlugs: ["main-campus", "downtown-clinic"] },
  { name: "Medicaid", shortName: "Medicaid", type: "Medicaid", locationSlugs: ["main-campus", "downtown-clinic", "northside-center"] },
  { name: "Tricare", shortName: "Tricare", type: "Other", locationSlugs: ["main-campus"] },
  { name: "Workers' Compensation", shortName: "Workers Comp", type: "Other", locationSlugs: ["main-campus", "downtown-clinic", "northside-center"] },
];

export function getInsuranceByLocation(locationSlug: string): InsuranceData[] {
  return insurancePlans.filter((p) => p.locationSlugs.includes(locationSlug));
}

export function getInsuranceByType(type: InsuranceData["type"]): InsuranceData[] {
  return insurancePlans.filter((p) => p.type === type);
}

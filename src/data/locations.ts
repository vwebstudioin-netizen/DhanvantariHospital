import type { LocationData } from "@/types";

export const locations: LocationData[] = [
  {
    slug: "main",
    name: "Dhanvantari Hospital",
    address: process.env.NEXT_PUBLIC_HOSPITAL_ADDRESS || "D.No.34-1-5, Dodipeta Vari Thota Vedhi, Beside CPI Office, Tanuku, West Godavari, Andhra Pradesh 534211",
    city: "Tanuku",
    state: "Andhra Pradesh",
    zipCode: "534211",
    phone: `${process.env.NEXT_PUBLIC_HOSPITAL_PHONE || "08819293445"} / ${process.env.NEXT_PUBLIC_HOSPITAL_PHONE2 || "7799381456"} / ${process.env.NEXT_PUBLIC_HOSPITAL_PHONE3 || "7799791456"}`,
    fax: "",
    email: process.env.NEXT_PUBLIC_HOSPITAL_EMAIL || "info@dhanvantarihospital.com",
    coordinates: { lat: 16.7626, lng: 81.6825 }, // Tanuku, West Godavari, AP
    hours: {
      monday: "24 Hours (Emergency Always Open)",
      tuesday: "24 Hours (Emergency Always Open)",
      wednesday: "24 Hours (Emergency Always Open)",
      thursday: "24 Hours (Emergency Always Open)",
      friday: "24 Hours (Emergency Always Open)",
      saturday: "24 Hours (Emergency Always Open)",
      sunday: "24 Hours (Emergency Always Open)",
    },
    departmentSlugs: [
      "general-medicine",
      "general-surgery",
      "gynecology",
      "pulmonology",
      "urology",
      "nephrology",
      "orthopedics",
      "neurology",
      "cardiology",
      "critical-care",
    ],
    image: "/images/locations/main.jpg",
  },
];

export function getLocationBySlug(slug: string): LocationData | undefined {
  return locations.find((l) => l.slug === slug);
}

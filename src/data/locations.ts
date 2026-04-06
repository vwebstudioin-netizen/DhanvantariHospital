import type { LocationData } from "@/types";

export const locations: LocationData[] = [
  {
    slug: "main",
    name: "Dhanvantari Hospital",
    address: process.env.NEXT_PUBLIC_HOSPITAL_ADDRESS || "Mysuru",
    city: "Mysuru",
    state: "Karnataka",
    zipCode: "570001",
    phone: process.env.NEXT_PUBLIC_HOSPITAL_PHONE || "",
    fax: "",
    email: process.env.NEXT_PUBLIC_HOSPITAL_EMAIL || "info@dhanvantarihospital.com",
    coordinates: { lat: 12.2958, lng: 76.6394 }, // Mysuru, Karnataka
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
      "pediatrics",
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

import type { LocationData } from "@/types";

export const locations: LocationData[] = [
  {
    slug: "main",
    name: "Dhanvantari Hospital",
    address: "Your Address Here",
    city: "City",
    state: "State",
    zipCode: "000000",
    phone: "9876543210",
    fax: "",
    email: "info@dhanvantarihospital.com",
    coordinates: { lat: 17.385, lng: 78.4867 },
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

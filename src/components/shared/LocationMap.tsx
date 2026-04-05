"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/shared/Map"), { ssr: false });

interface LocationMapProps {
  locations: { name: string; address: string; coordinates: { lat: number; lng: number } }[];
  center: { lat: number; lng: number };
}

export default function LocationMap({ locations, center }: LocationMapProps) {
  return <Map locations={locations} center={center} />;
}

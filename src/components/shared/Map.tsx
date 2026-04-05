"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface MapProps {
  locations: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  }[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

export default function Map({
  locations,
  center,
  zoom = 12,
  height = "400px",
}: MapProps) {
  const mapCenter = center || locations[0]?.coordinates || { lat: 39.7817, lng: -89.6501 };

  return (
    <div style={{ height }} className="w-full overflow-hidden rounded-xl">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc) => (
          <Marker
            key={loc.name}
            position={[loc.coordinates.lat, loc.coordinates.lng]}
          >
            <Popup>
              <strong>{loc.name}</strong>
              <br />
              {loc.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

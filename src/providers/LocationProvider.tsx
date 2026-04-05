"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { locations } from "@/data/locations";
import type { LocationData } from "@/types";

interface LocationContextType {
  selectedLocation: LocationData;
  setSelectedLocation: (location: LocationData) => void;
  allLocations: LocationData[];
}

const LocationContext = createContext<LocationContextType>({
  selectedLocation: locations[0],
  setSelectedLocation: () => {},
  allLocations: locations,
});

export function useLocationContext() {
  return useContext(LocationContext);
}

export default function LocationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(
    locations[0]
  );

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        allLocations: locations,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

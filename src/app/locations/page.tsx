import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import GoogleMap from "@/components/shared/GoogleMap";
import { locations } from "@/data/locations";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Location",
  description: "Visit Dhanvantari Hospital — Emergency care available 24/7. Find our address and contact details.",
};

export default function LocationsPage() {
  return (
    <>
      <PageHero
        title="Our Location"
        subtitle="Emergency treatment available 24 hours. Find us and get directions."
        breadcrumbs={[{ label: "Location" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl space-y-8">
          {locations.map((loc) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className="group flex flex-col gap-6 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg md:flex-row"
            >
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-10 w-10" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:text-primary">
                  {loc.name}
                </h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  Multi-specialty hospital with Emergency Critical Care Unit at {loc.address}, {loc.city}.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {loc.address}, {loc.city}, {loc.state} {loc.zipCode}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    {loc.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {loc.hours.monday}
                  </span>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  View Details <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Map for each location */}
      {locations.filter(l => l.coordinates).map(loc => (
        <section key={loc.slug} className="px-4 pb-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Get Directions
            </h2>
            <GoogleMap
              lat={loc.coordinates!.lat}
              lng={loc.coordinates!.lng}
              label={loc.name}
              height="400px"
            />
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{loc.address}, {loc.city}, {loc.state} {loc.zipCode}</span>
              <a href={`https://maps.google.com/?q=${loc.coordinates!.lat},${loc.coordinates!.lng}`}
                target="_blank" rel="noopener noreferrer"
                className="text-primary hover:underline font-medium">
                Open in Google Maps →
              </a>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

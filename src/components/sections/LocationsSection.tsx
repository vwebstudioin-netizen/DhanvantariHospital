import Link from "next/link";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { locations } from "@/data/locations";

export default function LocationsSection() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Find Us"
          title="Our Location"
          subtitle="Emergency treatment available 24 hours. Visit Dhanvantari Hospital for comprehensive multi-specialty care."
        />

        <div className="grid gap-6 md:grid-cols-1 max-w-2xl mx-auto">
          {locations.map((loc) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary">
                {loc.name}
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {loc.address}, {loc.city}, {loc.state} {loc.zipCode}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  {loc.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  {loc.hours.monday}
                </p>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {loc.departmentSlugs.length} departments available
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                View Details <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

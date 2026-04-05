import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { locations, getLocationBySlug } from "@/data/locations";
import { getDoctorsByLocation } from "@/data/doctors";
import { Button } from "@/components/ui/button";
import LocationMap from "@/components/shared/LocationMap";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocationBySlug(slug);
  if (!loc) return {};
  return {
    title: loc.name,
    description: `${loc.name} — ${loc.address}, ${loc.city}, ${loc.state} ${loc.zipCode}`,
  };
}

export default async function LocationDetailPage({ params }: Props) {
  const { slug } = await params;
  const loc = getLocationBySlug(slug);
  if (!loc) notFound();

  const locDoctors = getDoctorsByLocation(slug);

  return (
    <>
      <PageHero
        title={loc.name.replace("Dhanvantari Hospital — ", "")}
        subtitle={`Full-service healthcare at ${loc.address}, ${loc.city}`}
        breadcrumbs={[
          { label: "Locations", href: "/locations" },
          { label: loc.name.replace("Dhanvantari Hospital — ", "") },
        ]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Map */}
              <div className="mb-8 h-[400px] overflow-hidden rounded-xl border border-border">
                <LocationMap
                  locations={[{ name: loc.name, address: loc.address, coordinates: loc.coordinates }]}
                  center={loc.coordinates}
                />
              </div>

              {/* Departments */}
              {loc.departmentSlugs.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 text-xl font-bold text-foreground">
                    Departments at This Location
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {loc.departmentSlugs.map((d: string) => (
                      <Link
                        key={d}
                        href={`/departments/${d}`}
                        className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-foreground transition hover:border-primary/30 hover:text-primary"
                      >
                        {d.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctors */}
              {locDoctors.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-bold text-foreground">
                    Physicians at This Location
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {locDoctors.map((doc) => (
                      <Link
                        key={doc.slug}
                        href={`/doctors/${doc.slug}`}
                        className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:border-primary/30"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {doc.firstName[0]}
                          {doc.lastName[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary">
                            {doc.title} {doc.firstName} {doc.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {doc.specialty}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">
                  Contact Information
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {loc.address}, {loc.city}, {loc.state} {loc.zipCode}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-primary" />
                    {loc.phone}
                  </p>
                  {loc.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-primary" />
                      {loc.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Hours */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                  <Clock className="h-4 w-4 text-primary" /> Hours
                </h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(loc.hours).map(([day, hrs]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize text-foreground">{day}</span>
                      <span className="text-muted-foreground">{hrs}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-xl border border-border bg-card p-6">
                <Link href="/book">
                  <Button className="w-full gap-2">
                    <Calendar className="h-4 w-4" /> Book at This Location
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

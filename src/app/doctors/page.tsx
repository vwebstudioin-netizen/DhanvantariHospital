"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/layout/PageHero";
import { useDoctors } from "@/hooks/useDoctors";
import { departments } from "@/data/departments";
import { locations } from "@/data/locations";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, Search, ArrowRight, Video } from "lucide-react";

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const { doctors, isLoading } = useDoctors();

  const filtered = doctors.filter((doc) => {
    const matchesSearch =
      !search ||
      `${doc.firstName} ${doc.lastName} ${doc.specialty}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesDept = !selectedDept || doc.departmentSlugs.includes(selectedDept);
    const matchesLoc =
      !selectedLocation || doc.locationSlugs.includes(selectedLocation);
    return matchesSearch && matchesDept && matchesLoc;
  });

  return (
    <>
      <PageHero
        title="Our Physicians"
        subtitle="Meet our team of specialist doctors dedicated to exceptional patient care."
        breadcrumbs={[{ label: "Doctors" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search doctors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.slug} value={d.slug}>{d.name}</option>
              ))}
            </select>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
            >
              <option value="">All Locations</option>
              {locations.map((l) => (
                <option key={l.slug} value={l.slug}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Showing {filtered.length} physician{filtered.length !== 1 && "s"}
              </p>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((doc) => (
                  <Link
                    key={doc.slug}
                    href={`/doctors/${doc.slug}`}
                    className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
                  >
                    <div className="mb-4 flex items-center gap-4">
                      {/* Photo */}
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-primary/10">
                        {doc.image ? (
                          <Image
                            src={doc.image}
                            alt={`${doc.title} ${doc.firstName} ${doc.lastName}`}
                            fill className="object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-primary">
                            {doc.firstName[0]}{doc.lastName[0] || ""}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary">
                          {doc.title} {doc.firstName} {doc.lastName}
                        </h3>
                        <p className="text-sm text-primary">{doc.specialty}</p>
                        <p className="text-xs text-muted-foreground">{doc.credentials}</p>
                      </div>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {doc.acceptingNewPatients && (
                        <Badge variant="default" className="text-xs">Accepting Patients</Badge>
                      )}
                      {doc.offersTelehealth && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Video className="h-3 w-3" /> Telehealth
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <p className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {doc.locationSlugs.length} location{doc.locationSlugs.length !== 1 && "s"}
                      </p>
                    </div>

                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      View Profile <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  No physicians match your search. Try adjusting filters.
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

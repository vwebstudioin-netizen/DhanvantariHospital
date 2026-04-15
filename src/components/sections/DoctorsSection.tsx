"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Video } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { useDoctors } from "@/hooks/useDoctors";

export default function DoctorsSection() {
  const { doctors } = useDoctors();
  const featured = doctors.slice(0, 4);

  return (
    <section className="bg-muted/30 px-4 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Our Team"
          title="Meet Our Expert Physicians"
          subtitle="Board-certified specialists dedicated to providing exceptional patient care with compassion and expertise."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((doc) => (
            <Link
              key={doc.slug}
              href={`/doctors/${doc.slug}`}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
            >
              {/* Photo */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                {doc.image ? (
                  <Image
                    src={doc.image}
                    alt={`${doc.title} ${doc.firstName} ${doc.lastName}`}
                    fill className="object-cover object-top"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                      {doc.firstName[0]}{doc.lastName[0] || ""}
                    </div>
                  </div>
                )}
                {doc.offersTelehealth && (
                  <div className="absolute right-2 top-2">
                    <Badge variant="default" className="gap-1 text-xs">
                      <Video className="h-3 w-3" /> Telehealth
                    </Badge>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground group-hover:text-primary">
                  {doc.title} {doc.firstName} {doc.lastName}
                </h3>
                <p className="text-sm text-primary">{doc.specialty}</p>
                <p className="mt-1 text-xs text-muted-foreground">{doc.credentials}</p>
                {doc.acceptingNewPatients && (
                  <Badge variant="success" className="mt-2 text-xs">
                    Accepting New Patients
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View All Doctors <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

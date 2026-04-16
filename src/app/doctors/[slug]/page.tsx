import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { doctors, getDoctorBySlug } from "@/data/doctors";
import { getDepartmentBySlug } from "@/data/departments";
import { locations } from "@/data/locations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  GraduationCap,
  Award,
  Globe,
  MapPin,
  Phone,
  Video,
  CheckCircle,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return doctors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoctorBySlug(slug);
  if (!doc) return {};
  return {
    title: `${doc.title} ${doc.firstName} ${doc.lastName}`,
    description: doc.bio,
  };
}

export default async function DoctorDetailPage({ params }: Props) {
  const { slug } = await params;
  const doc = getDoctorBySlug(slug);
  if (!doc) notFound();

  const dept = doc.departmentSlugs[0] ? getDepartmentBySlug(doc.departmentSlugs[0]) : null;
  const docLocations = locations.filter((l) =>
    doc.locationSlugs.includes(l.slug)
  );

  return (
    <>
      <PageHero
        title={`${doc.title} ${doc.firstName} ${doc.lastName}`}
        subtitle={doc.specialty}
        breadcrumbs={[
          { label: "Doctors", href: "/doctors" },
          { label: `${doc.title} ${doc.lastName}` },
        ]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main */}
            <div className="lg:col-span-2">
              {/* Badges */}
              <div className="mb-6 flex flex-wrap gap-2">
                {doc.acceptingNewPatients && (
                  <Badge variant="default">Accepting New Patients</Badge>
                )}
                {doc.offersTelehealth && (
                  <Badge variant="secondary" className="gap-1">
                    <Video className="h-3 w-3" /> Telehealth Available
                  </Badge>
                )}
                {dept && <Badge variant="outline">{dept.name}</Badge>}
              </div>

              {/* Bio */}
              <h2 className="mb-3 text-xl font-bold text-foreground">About</h2>
              <p className="mb-8 text-muted-foreground leading-relaxed">
                {doc.bio}
              </p>

              {/* Specialties */}
              <h2 className="mb-3 text-xl font-bold text-foreground">
                Specialties
              </h2>
              <div className="mb-8 grid gap-2 sm:grid-cols-2">
                {doc.subspecialties.map((s: string) => (
                  <div
                    key={s}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {s}
                  </div>
                ))}
              </div>

              {/* Education */}
              <h2 className="mb-3 text-xl font-bold text-foreground">
                <GraduationCap className="mr-2 inline h-5 w-5" />
                Education
              </h2>
              <ul className="mb-8 space-y-2">
                {doc.education.map((e) => (
                  <li key={`${e.degree}-${e.institution}`} className="text-sm text-muted-foreground">
                    • {e.degree}, {e.institution} ({e.year})
                  </li>
                ))}
              </ul>

              {/* Certifications */}
              <h2 className="mb-3 text-xl font-bold text-foreground">
                <Award className="mr-2 inline h-5 w-5" />
                Certifications
              </h2>
              <ul className="mb-8 space-y-2">
                {doc.certifications.map((c) => (
                  <li key={c} className="text-sm text-muted-foreground">
                    • {c}
                  </li>
                ))}
              </ul>

              {/* Languages */}
              <h2 className="mb-3 text-xl font-bold text-foreground">
                <Globe className="mr-2 inline h-5 w-5" />
                Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {doc.languages.map((l) => (
                  <Badge key={l} variant="outline">
                    {l}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Book */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">
                  Schedule an Appointment
                </h3>
                <Link href="/book">
                  <Button className="w-full gap-2">
                    <Calendar className="h-4 w-4" /> Book Now
                  </Button>
                </Link>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Or call 08819293445
                </p>
              </div>

              {/* Locations */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">
                  Locations
                </h3>
                <div className="space-y-3">
                  {docLocations.map((loc) => (
                    <Link
                      key={loc.slug}
                      href={`/locations/${loc.slug}`}
                      className="block rounded-lg border border-border p-3 text-sm transition hover:border-primary/30"
                    >
                      <p className="flex items-center gap-1 font-medium text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {loc.name.replace("Dhanvantari Hospital — ", "")}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {loc.address}, {loc.city}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">
                  Contact Info
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    08819293445
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

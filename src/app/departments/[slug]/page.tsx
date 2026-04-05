import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { departments, getDepartmentBySlug } from "@/data/departments";
import { getServicesByDepartment } from "@/data/services";
import { getDoctorsByDepartment } from "@/data/doctors";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, CheckCircle } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return departments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dept = getDepartmentBySlug(slug);
  if (!dept) return {};
  return { title: dept.name, description: dept.description };
}

export default async function DepartmentDetailPage({ params }: Props) {
  const { slug } = await params;
  const dept = getDepartmentBySlug(slug);
  if (!dept) notFound();

  const deptServices = getServicesByDepartment(slug);
  const deptDoctors = getDoctorsByDepartment(slug);

  return (
    <>
      <PageHero
        title={dept.name}
        subtitle={dept.description}
        breadcrumbs={[
          { label: "Departments", href: "/departments" },
          { label: dept.name },
        ]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Conditions Treated */}
              {dept.conditionsTreated.length > 0 && (
                <div className="mb-10">
                  <h2 className="mb-4 text-xl font-bold text-foreground">Conditions Treated</h2>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {dept.conditionsTreated.map((c) => (
                      <div key={c} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {deptServices.length > 0 && (
                <div className="mb-10">
                  <h2 className="mb-4 text-xl font-bold text-foreground">Services in This Department</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {deptServices.map((s) => (
                      <Link key={s.slug} href={`/services/${s.slug}`} className="group rounded-lg border border-border bg-card p-4 hover:border-primary/30">
                        <h3 className="font-semibold text-foreground group-hover:text-primary">{s.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.shortDescription}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctors */}
              {deptDoctors.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-bold text-foreground">Department Physicians</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {deptDoctors.map((doc) => (
                      <Link key={doc.slug} href={`/doctors/${doc.slug}`} className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:border-primary/30">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {doc.firstName[0]}{doc.lastName[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary">
                            {doc.title} {doc.firstName} {doc.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{doc.specialty}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">Need an Appointment?</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Book an appointment with one of our {dept.name} specialists today.
                </p>
                <Link href="/book">
                  <Button className="w-full gap-2">
                    <Calendar className="h-4 w-4" /> Book Appointment
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

import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { departments } from "@/data/departments";
import { getServicesByDepartment } from "@/data/services";
import * as LucideIcons from "lucide-react";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Departments",
  description: "Explore Dhanvantari Hospital's 10 specialized medical departments providing comprehensive healthcare services.",
};

export default function DepartmentsPage() {
  return (
    <>
      <PageHero
        title="Our Departments"
        subtitle="10 specialized departments staffed by board-certified specialists providing the highest standard of care."
        breadcrumbs={[{ label: "Departments" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl space-y-8">
          {departments.map((dept) => {
            const IconComponent =
              (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
                dept.icon
              ] || LucideIcons.Stethoscope;
            const deptServices = getServicesByDepartment(dept.slug);

            return (
              <Link
                key={dept.slug}
                href={`/departments/${dept.slug}`}
                className="group flex flex-col gap-6 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg md:flex-row"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <IconComponent className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:text-primary">
                    {dept.name}
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {dept.description}
                  </p>
                  {deptServices.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Services: {deptServices.map((s) => s.title).join(", ")}
                    </p>
                  )}
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    View Department <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

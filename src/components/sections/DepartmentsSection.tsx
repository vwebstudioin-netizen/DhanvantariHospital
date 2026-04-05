import Link from "next/link";
import SectionHeader from "@/components/shared/SectionHeader";
import { departments } from "@/data/departments";
import * as LucideIcons from "lucide-react";
import { ArrowRight } from "lucide-react";

export default function DepartmentsSection() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Departments"
          title="10 Specialized Departments"
          subtitle="Our departments cover the full spectrum of healthcare needs with specialized teams and state-of-the-art facilities."
        />

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {departments.map((dept) => {
            const IconComponent =
              (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
                dept.icon
              ] || LucideIcons.Stethoscope;

            return (
              <Link
                key={dept.slug}
                href={`/departments/${dept.slug}`}
                className="group flex flex-col items-center rounded-xl border border-border bg-card p-5 text-center transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <IconComponent className="h-7 w-7" />
                </div>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
                  {dept.name}
                </h3>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/departments"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View All Departments <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

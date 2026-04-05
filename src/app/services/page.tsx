import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { services } from "@/data/services";
import * as LucideIcons from "lucide-react";
import { ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore the comprehensive healthcare services offered by Dhanvantari Hospital across 8 Departments and 1 location.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Comprehensive healthcare services designed to meet all your medical needs under one roof."
        breadcrumbs={[{ label: "Services" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const IconComponent =
                (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
                  service.icon
                ] || LucideIcons.Stethoscope;

              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary">
                    {service.title}
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-3">
                    {service.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {service.duration} min
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Details <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

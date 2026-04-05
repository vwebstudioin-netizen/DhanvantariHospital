import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { services } from "@/data/services";
import * as LucideIcons from "lucide-react";

export default function ServicesSection() {
  const featured = services.slice(0, 8);

  return (
    <section className="px-4 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Our Services"
          title="Comprehensive Healthcare Services"
          subtitle="From primary care to specialized treatments, we offer a full range of medical services under one roof."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((service) => {
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
                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                  {service.shortDescription}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Learn More <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

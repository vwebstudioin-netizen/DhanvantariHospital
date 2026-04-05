import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import Accordion from "@/components/shared/Accordion";
import { Button } from "@/components/ui/button";
import { services, getServiceBySlug } from "@/data/services";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero
        title={service.title}
        subtitle={service.shortDescription}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <p className="mb-8 text-muted-foreground leading-relaxed">
                {service.description}
              </p>

              <h2 className="mb-4 text-xl font-bold text-foreground">
                What&apos;s Included
              </h2>
              <div className="mb-8 grid gap-3 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {service.faq.length > 0 && (
                <>
                  <h2 className="mb-4 text-xl font-bold text-foreground">
                    Frequently Asked Questions
                  </h2>
                  <Accordion items={service.faq} />
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">
                  Service Details
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    Duration: {service.duration} minutes
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Badge variant="secondary">{service.departmentSlug.replace(/-/g, " ")}</Badge>
                  </p>
                </div>
                <Link href="/book" className="mt-6 block">
                  <Button className="w-full gap-2">
                    <Calendar className="h-4 w-4" />
                    Book This Service
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

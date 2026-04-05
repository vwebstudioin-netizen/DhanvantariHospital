import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Briefcase, ArrowLeft, Send } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

const demoJobs: Record<
  string,
  {
    title: string;
    department: string;
    location: string;
    type: string;
    posted: string;
    description: string;
    requirements: string[];
    benefits: string[];
  }
> = {
  "registered-nurse-med-surg": {
    title: "Registered Nurse — Med/Surg",
    department: "Nursing",
    location: "Main Campus",
    type: "Full-time",
    posted: "2024-11-20",
    description:
      "We are seeking a compassionate and skilled Registered Nurse to join our Medical-Surgical unit. You will provide direct patient care, administer medications, and collaborate with the healthcare team to deliver optimal outcomes.",
    requirements: [
      "Active RN license in the state of Illinois",
      "BSN degree preferred",
      "BLS and ACLS certification",
      "2+ years of Med/Surg experience",
      "Excellent communication skills",
    ],
    benefits: [
      "Competitive salary",
      "Health, dental, and vision insurance",
      "401(k) with employer match",
      "Paid time off",
      "Continuing education support",
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = demoJobs[slug];
  return {
    title: job?.title || "Job Opening",
    description: job?.description || "View this job opening at Dhanvantari Hospital.",
  };
}

export default async function CareerDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = demoJobs[slug];

  if (!job) {
    return (
      <>
        <PageHero
          title="Job Opening"
          subtitle="View details and apply for this position."
          breadcrumbs={[
            { label: "Careers", href: "/careers" },
            { label: "Position" },
          ]}
        />
        <section className="px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-6 text-muted-foreground">
              This job listing contains demo content. In production, job data
              would be fetched from Firestore.
            </p>
            <Link href="/careers">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Careers
              </Button>
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        title={job.title}
        subtitle={`${job.department} · ${job.location} · ${job.type}`}
        breadcrumbs={[
          { label: "Careers", href: "/careers" },
          { label: job.title },
        ]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="mb-8 text-muted-foreground leading-relaxed">
                {job.description}
              </p>

              <h2 className="mb-4 text-xl font-bold text-foreground">
                Requirements
              </h2>
              <ul className="mb-8 space-y-2">
                {job.requirements.map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <span className="mt-1 text-primary">•</span> {r}
                  </li>
                ))}
              </ul>

              <h2 className="mb-4 text-xl font-bold text-foreground">
                Benefits
              </h2>
              <ul className="space-y-2">
                {job.benefits.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <span className="mt-1 text-primary">✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">
                  Job Details
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    {job.department}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {job.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    {job.type}
                  </p>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Posted: {job.posted}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">
                  Ready to Apply?
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Send your resume and cover letter to start the application
                  process.
                </p>
                <Button className="w-full gap-2">
                  <Send className="h-4 w-4" /> Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

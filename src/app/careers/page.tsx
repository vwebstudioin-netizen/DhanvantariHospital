import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Briefcase, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Dhanvantari Hospital team. Explore current job openings across our 1 location.",
};

const demoJobs = [
  { slug: "registered-nurse-med-surg", title: "Registered Nurse — Med/Surg", department: "Nursing", location: "Main Campus", type: "Full-time", posted: "2024-11-20" },
  { slug: "medical-assistant", title: "Medical Assistant", department: "General Medicine", location: "Downtown Clinic", type: "Full-time", posted: "2024-11-18" },
  { slug: "front-desk-receptionist", title: "Front Desk Receptionist", department: "Administration", location: "Northside Center", type: "Part-time", posted: "2024-11-15" },
  { slug: "physical-therapist", title: "Physical Therapist", department: "Rehabilitation", location: "Main Campus", type: "Full-time", posted: "2024-11-12" },
  { slug: "pediatric-nurse-practitioner", title: "Pediatric Nurse Practitioner", department: "Pediatrics", location: "Main Campus", type: "Full-time", posted: "2024-11-10" },
  { slug: "billing-specialist", title: "Billing Specialist", department: "Finance", location: "Downtown Clinic", type: "Full-time", posted: "2024-11-08" },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        title="Join Our Team"
        subtitle="Build your career at Dhanvantari Hospital. We're always looking for dedicated professionals."
        breadcrumbs={[{ label: "Careers" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 rounded-xl border border-border bg-muted/30 p-8">
            <h2 className="mb-3 text-xl font-bold text-foreground">
              Why Work at Dhanvantari Hospital?
            </h2>
            <div className="grid gap-4 sm:grid-cols-3 text-sm text-muted-foreground">
              <div>✓ Competitive salary & benefits</div>
              <div>✓ Professional development</div>
              <div>✓ Collaborative environment</div>
              <div>✓ Work-life balance</div>
              <div>✓ 24/7 Availability</div>
              <div>✓ Make a difference daily</div>
            </div>
          </div>

          <h2 className="mb-6 text-xl font-bold text-foreground">
            Current Openings ({demoJobs.length})
          </h2>

          <div className="space-y-4">
            {demoJobs.map((job) => (
              <Link
                key={job.slug}
                href={`/careers/${job.slug}`}
                className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary">
                    {job.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" /> {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {job.type}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Apply <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

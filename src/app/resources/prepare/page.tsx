import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ShieldCheck, Stethoscope, FileText, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Prepare for Your Visit",
  description: "A step-by-step guide to help you prepare for your upcoming appointment at Dhanvantari Hospital.",
};

const beforeVisit = [
  "Confirm your appointment date, time, and location.",
  "Complete any required patient forms (available on our Forms page).",
  "Write down questions or concerns to discuss with your provider.",
  "Gather your current medications list (names and dosages).",
  "Bring your insurance card and a government-issued photo ID.",
  "Arrange transportation if needed — our locations have ample parking.",
  "Wear comfortable clothing appropriate for your exam type.",
  "Fast if instructed (e.g., for blood work or certain procedures).",
];

const dayOfVisit = [
  { title: "Arrive Early", description: "Please arrive 15 minutes before your scheduled appointment for check-in.", icon: Clock },
  { title: "Check In", description: "Visit the front desk with your ID and insurance card. We'll verify your information.", icon: ShieldCheck },
  { title: "Wait Comfortably", description: "Relax in our waiting area. You'll be called by name when it's time.", icon: CheckCircle },
  { title: "See Your Provider", description: "Your provider will discuss your health, perform any exams, and create a care plan.", icon: Stethoscope },
];

const afterVisit = [
  "Review your visit summary in the patient portal.",
  "Fill any prescriptions at your preferred pharmacy.",
  "Schedule follow-up appointments as recommended.",
  "Contact us with any post-visit questions or concerns.",
  "Complete any ordered lab work or imaging at your convenience.",
];

export default function PrepareForVisitPage() {
  return (
    <>
      <PageHero
        title="Prepare for Your Visit"
        subtitle="Be ready for a smooth and productive appointment with this preparation checklist."
        breadcrumbs={[
          { label: "Resources", href: "/resources" },
          { label: "Prepare for Visit" },
        ]}
      />

      {/* Before Your Visit */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Before Your Visit</h2>
          <div className="space-y-3">
            {beforeVisit.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Day Of */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Day of Your Visit</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dayOfVisit.map((step, i) => (
              <div key={step.title} className="rounded-xl border border-border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* After Your Visit */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground">After Your Visit</h2>
          <div className="space-y-3">
            {afterVisit.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <h3 className="font-semibold text-foreground">Cancellation Policy</h3>
                <p className="text-sm text-muted-foreground">
                  Please provide at least 24 hours notice if you need to cancel or reschedule. Late cancellations or no-shows may be subject to a fee.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/resources/forms">
              <Button>
                <FileText className="mr-2 h-4 w-4" /> Download Patient Forms
              </Button>
            </Link>
            <Link href="/book">
              <Button variant="outline">Book an Appointment</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { ClipboardList, Stethoscope, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "New Patient Information",
  description: "Everything new patients need to know before their first visit to Dhanvantari Hospital.",
};

const whatToBring = [
  "Government-issued photo ID (Aadhaar, PAN, Passport, or Driving License)",
  "Insurance card (front and back)",
  "List of current medications with dosages",
  "Previous medical records or test results (if available)",
  "Referral letter from your primary care provider (if required by insurance)",
  "Completed new patient registration forms (available online)",
  "Payment method for any copays or out-of-pocket costs",
];

const registrationSteps = [
  { step: "1", title: "Download Forms", description: "Download and complete our new patient registration forms before your visit to save time." },
  { step: "2", title: "Arrive Early", description: "Please arrive 15–20 minutes before your scheduled appointment for check-in and paperwork." },
  { step: "3", title: "Check In", description: "Present your ID and insurance card at the front desk. Our staff will verify your information." },
  { step: "4", title: "Meet Your Provider", description: "Your provider will review your health history and conduct a thorough initial evaluation." },
];

export default function NewPatientPage() {
  return (
    <>
      <PageHero
        title="New Patient Information"
        subtitle="Welcome to Dhanvantari Hospital! Here's everything you need to know for your first visit."
        breadcrumbs={[
          { label: "Resources", href: "/resources" },
          { label: "New Patient" },
        ]}
      />

      {/* What to Bring */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            <ClipboardList className="mr-2 inline h-6 w-6" />
            What to Bring
          </h2>
          <div className="space-y-3">
            {whatToBring.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Steps */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Registration Process</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {registrationSteps.map((s) => (
              <div key={s.step} className="rounded-xl border border-border bg-card p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white">
                  {s.step}
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <h3 className="mb-2 font-semibold text-foreground">Important Notes</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Minors must be accompanied by a parent or legal guardian.</li>
                  <li>• If you need to cancel or reschedule, please give at least 24 hours notice.</li>
                  <li>• Copays and outstanding balances are due at the time of service.</li>
                  <li>• If you require interpreter services, please let us know when scheduling.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/resources/forms">
              <Button>
                <FileText className="mr-2 h-4 w-4" /> Download Forms
              </Button>
            </Link>
            <Link href="/book">
              <Button variant="outline">
                <Stethoscope className="mr-2 h-4 w-4" /> Book Your First Visit
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

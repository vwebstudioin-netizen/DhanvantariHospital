import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { FileText, Download, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Patient Resources",
  description: "Download patient forms, access educational materials, and find helpful healthcare resources at Dhanvantari Hospital.",
};

const formResources = [
  { title: "New Patient Registration Form", description: "Required for all new patients before first visit.", format: "PDF" },
  { title: "Medical History Questionnaire", description: "Comprehensive health history for your provider.", format: "PDF" },
  { title: "Insurance Verification Form", description: "Help us verify your insurance coverage.", format: "PDF" },
  { title: "HIPAA Consent Form", description: "Privacy practices acknowledgment.", format: "PDF" },
  { title: "Prescription Refill Request", description: "Request a medication refill from your provider.", format: "PDF" },
  { title: "Medical Records Release", description: "Authorize the release of your medical records.", format: "PDF" },
];

const educationalResources = [
  { title: "Patient Portal Guide", description: "How to register and use your patient portal account.", href: "/portal" },
  { title: "Preparing for Your Visit", description: "What to bring and expect at your appointment.", href: "/faq" },
  { title: "Insurance & Billing FAQ", description: "Common questions about insurance and billing.", href: "/insurance" },
  { title: "Telehealth Instructions", description: "How to join a virtual appointment.", href: "/faq" },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        title="Patient Resources"
        subtitle="Forms, guides, and educational materials to support your care journey."
        breadcrumbs={[{ label: "Resources" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          {/* Downloadable Forms */}
          <h2 className="mb-6 text-xl font-bold text-foreground">
            Downloadable Forms
          </h2>
          <div className="mb-12 grid gap-4 sm:grid-cols-2">
            {formResources.map((form) => (
              <div
                key={form.title}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {form.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {form.description}
                  </p>
                  <button className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    <Download className="h-3.5 w-3.5" /> Download {form.format}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Educational Resources */}
          <h2 className="mb-6 text-xl font-bold text-foreground">
            Educational Resources
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {educationalResources.map((res) => (
              <Link
                key={res.title}
                href={res.href}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition hover:border-primary/30"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ExternalLink className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary">
                    {res.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {res.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

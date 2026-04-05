import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Patient Forms",
  description: "Download patient forms for your visit to Dhanvantari Hospital. Complete forms ahead of time to expedite your check-in.",
};

const forms = [
  { title: "New Patient Registration", description: "Required for all new patients. Includes personal info, medical history, and consent.", format: "PDF", category: "Registration" },
  { title: "Medical History Questionnaire", description: "Comprehensive health and family history form for your provider.", format: "PDF", category: "Registration" },
  { title: "Insurance Verification Form", description: "Provide your insurance details for coverage verification.", format: "PDF", category: "Insurance" },
  { title: "HIPAA Privacy Notice", description: "Acknowledgment of our privacy practices and patient rights.", format: "PDF", category: "Legal" },
  { title: "Consent to Treat", description: "General consent for examination and treatment.", format: "PDF", category: "Legal" },
  { title: "Authorization for Release of Records", description: "Authorize the release of your medical records to another provider.", format: "PDF", category: "Records" },
  { title: "Prescription Refill Request", description: "Request a medication refill from your provider.", format: "PDF", category: "Prescriptions" },
  { title: "Telehealth Consent Form", description: "Consent for receiving care via telehealth/video visit.", format: "PDF", category: "Telehealth" },
  { title: "Financial Responsibility Agreement", description: "Agreement regarding patient financial responsibility for services.", format: "PDF", category: "Insurance" },
  { title: "Minor Patient Consent", description: "Parental consent form for treatment of patients under 18.", format: "PDF", category: "Legal" },
];

const categories = [...new Set(forms.map((f) => f.category))];

export default function PatientFormsPage() {
  return (
    <>
      <PageHero
        title="Patient Forms"
        subtitle="Download and complete forms before your visit to save time during check-in."
        breadcrumbs={[
          { label: "Resources", href: "/resources" },
          { label: "Forms" },
        ]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-5">
            <p className="text-sm text-foreground">
              <strong>Tip:</strong> Complete these forms at home and bring them to your appointment. This helps us get you into the exam room faster. Forms can also be completed on-site during check-in.
            </p>
          </div>

          {categories.map((category) => (
            <div key={category} className="mb-10">
              <h2 className="mb-4 text-xl font-bold text-foreground">{category}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {forms
                  .filter((f) => f.category === category)
                  .map((form) => (
                    <div
                      key={form.title}
                      className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{form.title}</h3>
                        <p className="mb-2 text-xs text-muted-foreground">{form.description}</p>
                        <button className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                          <Download className="h-3 w-3" /> Download {form.format}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}

          <div className="mt-8 text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              Need help with a form? Contact our front desk.
            </p>
            <Link href="/contact">
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" /> Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

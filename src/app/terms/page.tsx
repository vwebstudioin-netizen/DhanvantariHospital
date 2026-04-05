import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Dhanvantari Hospital's terms of service governing your use of our website and services.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms of Service"
        subtitle="Last updated: November 1, 2024"
        breadcrumbs={[{ label: "Terms of Service" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-8 text-muted-foreground leading-relaxed">
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing and using the Dhanvantari Hospital website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">2. Use of Services</h2>
            <p>Our online services, including appointment booking and the patient portal, are provided for your convenience. These tools do not replace in-person medical consultation. For medical emergencies, always call 911.</p>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">3. Account Registration</h2>
            <p>You may need to create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">4. Appointment Cancellation</h2>
            <p>We require at least 24 hours notice for appointment cancellations. Repeated no-shows may result in a cancellation fee and may affect your ability to book future appointments.</p>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">5. Intellectual Property</h2>
            <p>All content on this website, including text, images, and logos, is the property of Dhanvantari Hospital and is protected by copyright law. Unauthorized reproduction is prohibited.</p>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">6. Limitation of Liability</h2>
            <p>Dhanvantari Hospital is not liable for any damages arising from the use of our website or reliance on information provided herein. Medical information on this site is for educational purposes only.</p>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">7. Changes to Terms</h2>
            <p>We may update these terms from time to time. Continued use of our services after changes constitutes acceptance of the updated terms.</p>
          </div>
          <p className="text-sm italic">This is a template terms of service for demonstration purposes. A production deployment should include legally reviewed terms.</p>
        </div>
      </section>
    </>
  );
}

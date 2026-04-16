import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Dhanvantari Hospital's privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle="Last updated: November 1, 2024"
        breadcrumbs={[{ label: "Privacy Policy" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-8 text-muted-foreground leading-relaxed">
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">1. Information We Collect</h2>
            <p>We collect personal information that you provide directly, including your name, contact details, date of birth, insurance information, and medical history. We also collect technical data such as IP addresses and browser type when you use our website.</p>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve our healthcare services, process appointments, communicate with you about your care, send appointment reminders, and comply with legal obligations. We do not sell your personal information to third parties.</p>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">3. HIPAA Compliance</h2>
            <p>As a healthcare provider, we comply with the Health Insurance Portability and Accountability Act (HIPAA). Your Protected Health Information (PHI) is handled in accordance with federal regulations and our Notice of Privacy Practices.</p>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">4. Data Security</h2>
            <p>We implement administrative, technical, and physical safeguards to protect your personal information. This includes encryption, access controls, and regular security assessments.</p>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">5. Cookies & Analytics</h2>
            <p>Our website uses cookies and similar technologies to improve your browsing experience and analyze site usage. You can control cookie settings through your browser preferences.</p>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">6. Your Rights</h2>
            <p>You have the right to access, correct, or request deletion of your personal information. To exercise these rights, please contact our Privacy Officer at info@dhanvantarihospital.com or call 08819293445.</p>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">7. Contact Us</h2>
            <p>If you have questions about this privacy policy, please contact our Privacy Officer at info@dhanvantarihospital.com.</p>
          </div>
          <p className="text-sm italic">This is a template privacy policy for demonstration purposes. A production deployment should include a legally reviewed privacy policy.</p>
        </div>
      </section>
    </>
  );
}

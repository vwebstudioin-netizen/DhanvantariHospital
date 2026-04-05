import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Dhanvantari Hospital's commitment to digital accessibility and ADA compliance.",
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        title="Accessibility Statement"
        subtitle="Our commitment to providing an inclusive digital experience for all users."
        breadcrumbs={[{ label: "Accessibility" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-8 text-muted-foreground leading-relaxed">
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">Our Commitment</h2>
            <p>Dhanvantari Hospital is committed to ensuring that our website is accessible to all users, including people with disabilities. We strive to comply with WCAG 2.1 AA standards and continuously improve our digital accessibility.</p>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">Accessibility Features</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Semantic HTML structure for screen reader compatibility</li>
              <li>Keyboard navigation support throughout the site</li>
              <li>High contrast color schemes and dark mode support</li>
              <li>Descriptive alt text for all images</li>
              <li>ARIA labels and roles for interactive elements</li>
              <li>Responsive design for all screen sizes</li>
              <li>Clear, readable typography</li>
              <li>Form labels and error messages for accessibility</li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">Physical Accessibility</h2>
            <p>All Dhanvantari Hospital locations are ADA compliant with wheelchair accessible entrances, elevators, accessible restrooms, and designated parking spaces. Service animals are welcome at all locations.</p>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">Feedback</h2>
            <p>If you encounter any accessibility barriers on our website or at our facilities, please contact us at accessibility@clinicarepro.com or call (555) 100-2000. We welcome your feedback and will make every effort to address your needs.</p>
          </div>
        </div>
      </section>
    </>
  );
}

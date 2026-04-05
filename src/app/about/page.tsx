import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import { Award, Users, Heart, Clock, Target, Shield } from "lucide-react";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Dhanvantari Hospital — our mission, values, history, and commitment to providing exceptional multi-specialty healthcare.",
};

const values = [
  { icon: Heart, title: "Patient-Centered Care", description: "Every decision we make puts our patients' wellbeing first." },
  { icon: Award, title: "Clinical Excellence", description: "Board-certified specialists using evidence-based practices." },
  { icon: Users, title: "Collaborative Approach", description: "Our teams work together to deliver coordinated, comprehensive care." },
  { icon: Shield, title: "Trust & Integrity", description: "Transparent communication and ethical practices in everything we do." },
  { icon: Target, title: "Innovation", description: "Embracing technology and modern techniques to improve outcomes." },
  { icon: Clock, title: "Accessibility", description: "24/7 Availability, extended hours, and telehealth options for convenience." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Dhanvantari Hospital"
        subtitle="Advanced multi-specialty healthcare serving our community with compassion, expertise, and innovation since 2010."
        breadcrumbs={[{ label: "About Us" }]}
      />

      {/* Mission */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-foreground">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Dhanvantari Hospital is dedicated to providing accessible, high-quality healthcare
                that improves the lives of our patients and strengthens our community. We
                combine medical expertise with cutting-edge technology to deliver
                personalized care that addresses each patient&apos;s unique needs.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Founded in 2010, we have grown from a single practice to a multi-location
                healthcare network with over 30 specialists across 10 medical departments.
                Our growth reflects our unwavering commitment to clinical excellence and
                patient satisfaction.
              </p>
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-bold text-foreground">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                We envision a healthier community where every individual has access to
                exceptional healthcare. By continuously expanding our services, investing
                in our team, and adopting innovative approaches, we strive to set the
                standard for multi-specialty outpatient care.
              </p>
              <div className="mt-6 rounded-xl border border-border bg-muted/30 p-6">
                <p className="text-sm font-medium text-foreground">By the Numbers</p>
                <div className="mt-3 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">14+</p>
                    <p className="text-xs text-muted-foreground">Years of Service</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">30+</p>
                    <p className="text-xs text-muted-foreground">Specialists</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">10</p>
                    <p className="text-xs text-muted-foreground">Departments</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">3</p>
                    <p className="text-xs text-muted-foreground">Locations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Our Core Values</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6">
                <v.icon className="mb-3 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold text-foreground">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

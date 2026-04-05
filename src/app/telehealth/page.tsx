import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Video, Monitor, Smartphone, ShieldCheck, Clock, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Telehealth & Virtual Visits",
  description: "Connect with your Dhanvantari Hospital provider from the comfort of home with our secure telehealth services.",
};

const benefits = [
  { icon: Clock, title: "No Travel Time", description: "Skip the commute and waiting room. See your provider from anywhere." },
  { icon: ShieldCheck, title: "Secure & Private", description: "HIPAA-compliant video visits protect your health information." },
  { icon: Smartphone, title: "Easy to Use", description: "Join from your phone, tablet, or computer — no special software needed." },
  { icon: Monitor, title: "Same Quality Care", description: "Receive the same thorough care as an in-person visit for eligible conditions." },
];

const eligibleServices = [
  "Follow-up appointments",
  "Prescription refills & management",
  "Minor illness consultations (cold, flu, allergies)",
  "Skin conditions & rashes",
  "Mental health counseling",
  "Chronic condition management (diabetes, hypertension)",
  "Lab result reviews",
  "Pre-operative consultations",
  "Post-surgical follow-ups",
  "Nutritional counseling",
];

const steps = [
  { step: "1", title: "Schedule", description: "Book a telehealth visit online or call our office. Select 'Virtual Visit' as the appointment type." },
  { step: "2", title: "Prepare", description: "You'll receive a confirmation email with a secure link. Test your camera and microphone before the visit." },
  { step: "3", title: "Connect", description: "Click the link at your appointment time to join the video call with your provider." },
  { step: "4", title: "Follow Up", description: "Your provider will share notes, prescriptions, and any follow-up instructions through the patient portal." },
];

export default function TelehealthPage() {
  return (
    <>
      <PageHero
        title="Telehealth & Virtual Visits"
        subtitle="Quality healthcare from the comfort of your home. Connect with our providers via secure video visits."
        breadcrumbs={[{ label: "Telehealth" }]}
      />

      {/* Benefits */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Why Choose Virtual Visits?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-xl border border-border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">How It Works</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="relative rounded-xl border border-border bg-card p-6">
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

      {/* Eligible Services */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Eligible Services</h2>
          <p className="mb-6 text-muted-foreground">
            Many common health concerns can be addressed via telehealth. Below are some of the services available through virtual visits:
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {eligibleServices.map((service) => (
              <div key={service} className="flex items-center gap-2 rounded-lg p-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-foreground">{service}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h3 className="mb-2 font-semibold text-foreground">Not Sure If Telehealth Is Right for You?</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Some conditions require an in-person evaluation. Call us and our team will help you determine the best visit type.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/book">
                <Button>Schedule a Virtual Visit</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Requirements */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Technical Requirements</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Device</h3>
              <p className="text-sm text-muted-foreground">Smartphone, tablet, laptop, or desktop computer with a camera and microphone.</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Internet</h3>
              <p className="text-sm text-muted-foreground">Stable internet connection (minimum 1.5 Mbps recommended for HD video).</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Browser</h3>
              <p className="text-sm text-muted-foreground">Latest version of Chrome, Safari, Firefox, or Edge. No app downloads required.</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Environment</h3>
              <p className="text-sm text-muted-foreground">A quiet, private space with good lighting for the best experience.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { Calendar, Clock, Shield, Users, Star, Laptop } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const features = [
  {
    icon: Calendar,
    title: "Easy Online Booking",
    description: "Schedule appointments online with our 8-step booking wizard. Choose your doctor, date, and time in minutes.",
  },
  {
    icon: Users,
    title: "Expert Specialists",
    description: "Access board-certified physicians across 10 medical departments, all under one network.",
  },
  {
    icon: Shield,
    title: "Insurance Accepted",
    description: "We accept most major insurance plans including HMO, PPO, Medicare, and Medicaid.",
  },
  {
    icon: Laptop,
    title: "Patient Portal",
    description: "Manage appointments, message your care team, and access your health information securely online.",
  },
  {
    icon: Clock,
    title: "Extended Hours",
    description: "Open early and late with same-day appointments available. Walk-in urgent care during extended hours.",
  },
  {
    icon: Star,
    title: "Top-Rated Care",
    description: "Consistently rated among the best healthcare providers by our patients for quality and compassion.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="bg-muted/30 px-4 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Why Choose Us"
          title="Why Patients Choose Dhanvantari Hospital"
          subtitle="We combine medical excellence with patient-centered care to deliver the best healthcare experience."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

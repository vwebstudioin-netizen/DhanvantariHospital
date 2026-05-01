import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import CTASection from "@/components/sections/CTASection";
import { Award, Star, Heart, Users, Stethoscope, Shield, BookOpen, Phone } from "lucide-react";
import { CONTACT_PHONE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Founding Members | Dhanvantari Hospital",
  description:
    "Meet the visionary founders of Dhanvantari Hospital — the dedicated doctors and leaders who built a world-class multi-specialty healthcare institution in Tanuku, West Godavari.",
};

const founders = [
  {
    slug: "dr-ayyapa",
    name: "Dr. Ayyapa",
    title: "Founder & Chief of Medicine",
    credentials: "MBBS, MD",
    specialty: "Emergency & Critical Care",
    image: "/images/doctors/dr-ayyapa.jpg",
    role: "Founder",
    year: "2026",
    quote:
      "Our mission has always been simple — every patient who walks through our doors deserves the best possible care, regardless of the hour. That belief is what Dhanvantari Hospital was built on.",
    bio: "Dr. Ayyapa is the visionary founder of Dhanvantari Hospital. With extensive experience in emergency medicine and critical care, he established the hospital in 2026 with a singular focus: to provide life-saving emergency treatment for accident cases and comprehensive multi-specialty healthcare to the people of Tanuku and the broader West Godavari district.",
    achievements: [
      "Founded Dhanvantari Hospital in 2026",
      "Built the region's leading Critical Care & Emergency Unit",
      "Expanded to 10 medical departments",
      "Serving 10,000+ patients across West Godavari",
    ],
    expertise: [
      "Emergency Trauma",
      "Critical Care",
      "Intensive Care",
      "Accident & Polytrauma",
    ],
  },
];

const milestones = [
  {
    year: "Jan 2026",
    title: "Hospital Founded",
    description:
      "Dr. Ayyapa established Dhanvantari Hospital in Tanuku with a focus on emergency care and 24/7 accident treatment.",
  },
  {
    year: "Feb 2026",
    title: "Critical Care Unit Launched",
    description:
      "Opened a dedicated ICU and critical care wing to handle complex and life-threatening cases round the clock.",
  },
  {
    year: "Mar 2026",
    title: "Multi-Specialty Services",
    description:
      "Expanded to 10 specialty departments including Surgery, Gynecology, Urology, and General Medicine.",
  },
  {
    year: "Apr 2026",
    title: "Specialist Team On Board",
    description:
      "Recruited 8+ specialist doctors to deliver comprehensive care across all departments.",
  },
  {
    year: "May 2026",
    title: "Digital Portal Live",
    description:
      "Launched the hospital's online appointment portal, queue management, and patient portal for seamless care.",
  },
  {
    year: "2026 →",
    title: "Growing With the Community",
    description:
      "Continuing to expand services, upgrade infrastructure, and serve every patient across West Godavari district.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Care for All",
    description:
      "Founded with the belief that quality emergency care must be accessible to every person in need.",
  },
  {
    icon: Stethoscope,
    title: "Clinical Excellence",
    description:
      "A commitment to evidence-based medicine and ongoing training ensures the highest standards of treatment.",
  },
  {
    icon: Shield,
    title: "24/7 Availability",
    description:
      "Emergency care never sleeps — the hospital has operated round-the-clock since day one.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "Rooted in Tanuku, the founders built the hospital to serve and grow with the local community.",
  },
  {
    icon: BookOpen,
    title: "Continuous Learning",
    description:
      "From the beginning, the founding team fostered a culture of learning and staying current with medical advances.",
  },
  {
    icon: Award,
    title: "Trust & Integrity",
    description:
      "Transparent, ethical practice has been the cornerstone of the hospital's reputation since founding.",
  },
];

export default function FoundingMembersPage() {
  return (
    <>
      <PageHero
        title="Our Founding Members"
        subtitle="Meet the visionary doctors and leaders who built Dhanvantari Hospital from the ground up — dedicated to bringing world-class healthcare to Tanuku and West Godavari."
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "Founding Members" },
        ]}
      />

      {/* Founding Story */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
                Our Story
              </span>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Built on a Vision of Accessible Emergency Care
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In 2026, Dr. Ayyapa recognised a critical gap in West Godavari — the absence of
                a dedicated emergency and critical care facility that could serve accident victims
                and seriously ill patients around the clock. Driven by that vision, Dhanvantari
                Hospital was born in the heart of Tanuku.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                What started as a focused emergency unit quickly grew into a full multi-specialty
                hospital as the founding team recruited specialist doctors, upgraded infrastructure,
                and expanded services — all while keeping patient welfare at the centre of every
                decision.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, Dhanvantari Hospital stands as a testament to that founding vision: 10
                departments, 8+ specialist doctors, a modern ICU, and a community of over
                10,000 patients who trust us with their care.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                {[
                  { value: "2026", label: "Founded" },
                  { value: "10,000+", label: "Patients Served" },
                  { value: "10", label: "Departments" },
                  { value: "24/7", label: "Emergency Care" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="bg-muted/20 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
              The Founders
            </span>
            <h2 className="text-3xl font-bold text-foreground">
              The People Behind Dhanvantari Hospital
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Dedicated doctors and healthcare leaders who committed their careers to building
              an institution the community could rely on.
            </p>
          </div>

          <div className="space-y-12">
            {founders.map((founder) => (
              <div
                key={founder.slug}
                className="rounded-2xl border border-border bg-background overflow-hidden shadow-sm"
              >
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Photo & Badge */}
                  <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center p-10 gap-4">
                    <div className="relative">
                      <div className="h-40 w-40 rounded-full border-4 border-primary/30 overflow-hidden bg-muted shadow-lg">
                        <Image
                          src={founder.image}
                          alt={founder.name}
                          width={160}
                          height={160}
                          className="object-cover w-full h-full"
                          onError={() => {}}
                        />
                      </div>
                      <span className="absolute -bottom-2 -right-2 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-white shadow">
                        {founder.role}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{founder.name}</p>
                      <p className="text-sm text-primary font-medium">{founder.credentials}</p>
                      <p className="text-xs text-muted-foreground mt-1">{founder.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      <span>Since {founder.year}</span>
                    </div>
                    <Link
                      href={`/doctors/${founder.slug}`}
                      className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                    >
                      View Full Profile
                    </Link>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2 p-8 flex flex-col justify-between gap-6">
                    {/* Quote */}
                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground text-sm leading-relaxed">
                      &ldquo;{founder.quote}&rdquo;
                    </blockquote>

                    {/* Bio */}
                    <p className="text-muted-foreground text-sm leading-relaxed">{founder.bio}</p>

                    {/* Achievements & Expertise */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                          <Award className="h-4 w-4 text-primary" /> Key Achievements
                        </h4>
                        <ul className="space-y-1.5">
                          {founder.achievements.map((a) => (
                            <li key={a} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                          <Stethoscope className="h-4 w-4 text-primary" /> Areas of Expertise
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {founder.expertise.map((e) => (
                            <span
                              key={e}
                              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                            >
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Values */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
              Core Values
            </span>
            <h2 className="text-3xl font-bold text-foreground">
              The Principles We Were Founded On
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              These values were instilled by the founders from day one and continue to guide
              every aspect of care at Dhanvantari Hospital.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-background p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="bg-muted/20 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
              Our Journey
            </span>
            <h2 className="text-3xl font-bold text-foreground">
              Milestones Since Founding
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              From a single emergency unit to a full-scale multi-specialty hospital — the story
              of growth guided by the founders&apos; vision.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-0.5" />

            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex items-start gap-4 md:gap-0 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-bold text-primary shadow-sm md:absolute md:left-1/2 md:-translate-x-1/2">
                    {m.year}
                  </div>

                  {/* Card */}
                  <div
                    className={`ml-4 rounded-xl border border-border bg-background p-5 shadow-sm md:ml-0 md:w-[calc(50%-2.5rem)] ${
                      i % 2 === 0 ? "md:mr-auto md:ml-0 md:pr-6" : "md:ml-auto md:pl-6"
                    }`}
                  >
                    <h4 className="font-semibold text-foreground">{m.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Founders CTA */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-10">
            <div className="mb-4 inline-flex rounded-full bg-primary/10 p-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Connect With Our Leadership
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We welcome inquiries from medical professionals, community organisations, and
              patients. Our founding leadership team is committed to being accessible and
              responsive.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                Get in Touch
              </Link>
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Call {CONTACT_PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

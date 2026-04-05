"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Phone, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-teal-50 dark:from-primary/10 dark:to-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 py-16 md:flex-row md:py-24">
        {/* Text */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Shield className="h-4 w-4" />
            Emergency Treatment for Accident Cases — Available 24/7
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Dhanvantari{" "}
            <span className="text-primary">Hospital</span>
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground">
            Multi-specialty care with Emergency Critical Care Unit. General Medicine, Surgery, Gynecology, Pediatrics, Orthopedics, Neurology, Cardiology — all under one roof.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/book">
              <Button size="lg" className="gap-2">
                <Calendar className="h-5 w-5" />
                Book Appointment
              </Button>
            </Link>
            <Link href="/doctors">
              <Button variant="outline" size="lg" className="gap-2">
                Find a Doctor
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4 text-primary" />
              (555) 100-2000
            </span>
            <span>Mon–Fri: 7AM–7PM</span>
          </div>
        </div>

        {/* Image placeholder */}
        <div className="flex-1">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-teal-100 shadow-2xl dark:from-primary/30 dark:to-teal-900/30">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <p className="text-lg font-semibold text-foreground">
                  Dhanvantari Hospital
                </p>
                <p className="text-sm text-muted-foreground">
                  Your Health, Our Priority
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

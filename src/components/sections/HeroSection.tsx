"use client";

import Link from "next/link";
import { Calendar, Phone, Shield, ArrowRight, Clock, MapPin, Heart, Activity, Stethoscope } from "lucide-react";
import { CONTACT_PHONE, HOSPITAL_ADDRESS } from "@/lib/constants";

export default function HeroSection() {
  return (
    <>
      {/* Emergency strip */}
      <div className="bg-red-600 text-white text-center text-sm font-semibold py-2 px-4 tracking-wide">
        🚨 24/7 Emergency &amp; Accident Care — Immediate Attention Guaranteed
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0f1729]">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1e40af 0%, transparent 40%)" }} />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-20 md:flex-row md:py-28">

          {/* Left — text */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/80">
              <Shield className="h-4 w-4 text-yellow-400" />
              NABH Accredited Multi-Specialty Hospital
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              Your Health,{" "}
              <span className="text-yellow-400">Our Priority</span>
            </h1>

            <p className="max-w-lg text-lg text-white/70 leading-relaxed">
              Dhanvantari Hospital — advanced multi-specialty care in Mysuru. Emergency, Surgery, Gynecology, Pediatrics, Orthopedics, Neurology, Cardiology and more under one roof.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 text-base font-bold text-[#0f1729] hover:bg-yellow-300 transition-colors shadow-lg">
                <Calendar className="h-5 w-5" />
                Book Appointment
              </Link>
              <Link href="/doctors"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white hover:bg-white/20 transition-colors">
                Find a Doctor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-white/60">
              {CONTACT_PHONE && (
                <a href={`tel:${CONTACT_PHONE}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 text-yellow-400" /> {CONTACT_PHONE}
                </a>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-yellow-400" /> Emergency: 24/7
              </span>
              {HOSPITAL_ADDRESS && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-yellow-400" /> {HOSPITAL_ADDRESS}
                </span>
              )}
            </div>
          </div>

          {/* Right — visual panel */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Main card */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 text-center">
                {/* Large cross icon */}
                <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-white/10 border-4 border-yellow-400/40">
                  <svg viewBox="0 0 60 60" className="h-16 w-16" fill="none">
                    <rect x="22" y="4" width="16" height="52" rx="4" fill="#facc15" />
                    <rect x="4" y="22" width="52" height="16" rx="4" fill="#facc15" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Dhanvantari Hospital</h2>
                <p className="text-white/50 text-sm mb-6">Advanced Multi-Specialty Healthcare</p>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Heart,        label: "Emergency",  sub: "24/7 Care" },
                    { icon: Stethoscope,  label: "8+",         sub: "Specialists" },
                    { icon: Activity,     label: "10,000+",    sub: "Patients" },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 p-3">
                      <s.icon className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                      <p className="text-white text-sm font-bold">{s.label}</p>
                      <p className="text-white/50 text-xs">{s.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-red-600 text-white rounded-xl px-3 py-2 text-xs font-bold shadow-lg">
                🚑 Emergency Ready
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="relative h-10 bg-[#0f1729]">
          <svg viewBox="0 0 1440 40" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>
    </>
  );
}

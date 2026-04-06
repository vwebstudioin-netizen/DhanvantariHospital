import Link from "next/link";
import { Calendar, Phone } from "lucide-react";
import { CONTACT_PHONE } from "@/lib/constants";

export default function CTASection() {
  return (
    <section className="bg-[#0f1729] px-4 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-block bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          Book Your Appointment Today
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl mb-4">
          Your Health Matters — <span className="text-yellow-400">We're Here for You</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-white/60 mb-10">
          Expert care across 8 specialties. Book online in minutes, or call us directly. Walk-ins welcome for urgent care and emergencies.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/book"
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-8 py-3.5 text-base font-bold text-[#0f1729] hover:bg-yellow-300 transition-colors shadow-lg">
            <Calendar className="h-5 w-5" /> Book Online Now
          </Link>
          {CONTACT_PHONE && (
            <a href={`tel:${CONTACT_PHONE}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-colors">
              <Phone className="h-5 w-5" /> {CONTACT_PHONE}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

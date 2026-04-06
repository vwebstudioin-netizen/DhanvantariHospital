"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar, MessageSquare, Star, ArrowRight, Phone,
  CreditCard, Receipt, Ticket, Activity,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthContext } from "@/providers/AuthProvider";
import { getPatient } from "@/lib/patients";

export default function PortalDashboard() {
  const { user, loading } = useAuthContext();
  const [patient, setPatient]     = useState<any>(null);
  const [appointments, setAppts]  = useState<any[]>([]);
  const [invoices, setInvoices]   = useState<any[]>([]);
  const [cards, setCards]         = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) { setDataLoading(false); return; }
    async function load() {
      setDataLoading(true);
      try {
        const pat = await getPatient(user!.uid);
        setPatient(pat);
        const phone = pat?.phone?.trim();
        const email = user!.email?.trim();

        // Fetch all collections and filter client-side by email or phone
        const [apptSnap, invSnap, cardSnap] = await Promise.allSettled([
          getDocs(collection(db, "appointments")),
          getDocs(collection(db, "invoices")),
          getDocs(collection(db, "inpatientCards")),
        ]);

        if (apptSnap.status === "fulfilled") {
          const all = apptSnap.value.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
          setAppts(all.filter(a =>
            (email && a.patientEmail === email) ||
            (phone && a.patientPhone === phone)
          ).sort((a, b) => (b.date > a.date ? 1 : -1)).slice(0, 5));
        }
        if (invSnap.status === "fulfilled" && phone) {
          const all = invSnap.value.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
          setInvoices(all.filter(i => i.patientPhone === phone)
            .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
            .slice(0, 5));
        }
        if (cardSnap.status === "fulfilled" && phone) {
          const all = cardSnap.value.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
          setCards(all.filter(c => c.patientPhone === phone && c.isActive));
        }
      } catch { /* silent */ }
      finally { setDataLoading(false); }
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const firstName = user?.displayName?.split(" ")[0] || "Patient";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, {firstName}!</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
      </div>

      {/* No phone warning */}
      {!dataLoading && patient && !patient.phone && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Phone number not linked</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Your bills and in-patient cards can't be shown without a phone number.{" "}
              <Link href="/portal/profile" className="underline font-medium">Add it in your profile →</Link>
            </p>
          </div>
        </div>
      )}

      {/* Active cards */}
      {cards.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-foreground text-sm">Active In-Patient / OPD Cards</h2>
          </div>
          <div className="divide-y divide-border">
            {cards.map(c => (
              <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{c.cardNumber}</p>
                  <p className="text-xs text-muted-foreground">{c.diagnosis} · Dr. {c.doctorName}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  c.type === "room" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                }`}>{c.type === "room" ? "IPD" : "OPD"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming appointments */}
      {appointments.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground text-sm">Your Appointments</h2>
            </div>
            <Link href="/portal/appointments" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {appointments.map(a => (
              <div key={a.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{a.serviceSlug || a.purpose || "Appointment"}</p>
                  <p className="text-xs text-muted-foreground">{a.date} · {a.time}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                  a.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                  a.status === "completed" ? "bg-green-100 text-green-700" :
                  a.status === "cancelled" ? "bg-red-100 text-red-700" :
                  "bg-amber-100 text-amber-700"
                }`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent bills */}
      {invoices.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-foreground text-sm">Recent Invoices</h2>
          </div>
          <div className="divide-y divide-border">
            {invoices.map(inv => (
              <div key={inv.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{inv.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {inv.createdAt?.toDate?.()?.toLocaleDateString("en-IN") ?? "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">₹{(inv.total ?? 0).toLocaleString("en-IN")}</p>
                  <span className={`text-xs font-medium ${inv.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"}`}>
                    {inv.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/portal/appointments", label: "Appointments",  icon: Calendar,      desc: "View & book" },
          { href: "/book",                label: "Book Appointment",icon: Ticket,       desc: "New appointment" },
          { href: "/portal/messages",     label: "Messages",      icon: MessageSquare,  desc: "From hospital" },
          { href: "/reviews/submit",      label: "Leave a Review", icon: Star,          desc: "Share feedback" },
        ].map(link => (
          <Link key={link.href} href={link.href}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary hover:shadow-sm transition-all group flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <link.icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary">{link.label}</p>
              <p className="text-xs text-muted-foreground">{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

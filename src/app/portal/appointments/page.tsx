"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthContext } from "@/providers/AuthProvider";
import { getPatient } from "@/lib/patients";
import { Calendar, Clock, Plus, Stethoscope } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700",
  pending:   "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  arrived:   "bg-purple-100 text-purple-700",
};

export default function PortalAppointments() {
  const { user } = useAuthContext();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const pat = await getPatient(user!.uid);
        const email = user!.email?.trim();
        const phone = pat?.phone?.trim();

        const snap = await getDocs(collection(db, "appointments"));
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
        const mine = all.filter(a =>
          (email && a.patientEmail === email) ||
          (phone && a.patientPhone === phone)
        ).sort((a, b) => (b.date > a.date ? 1 : -1));
        setAppointments(mine);
      } catch { /* silent */ }
      finally { setLoading(false); }
    }
    load();
  }, [user]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My Appointments</h1>
        <Link href="/book"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] transition-colors">
          <Plus className="h-4 w-4" /> Book New
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse h-20" />)}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No appointments found</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Your booked appointments will appear here.</p>
          <Link href="/book" className="text-sm text-primary hover:underline">Book an appointment →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map(appt => (
            <div key={appt.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Stethoscope className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {appt.serviceSlug?.replace(/-/g, " ") || appt.purpose || "Appointment"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appt.doctorName || appt.departmentSlug?.replace(/-/g, " ") || "Hospital"}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize shrink-0 ${STATUS_COLORS[appt.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {appt.status}
                </span>
              </div>
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{appt.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{appt.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

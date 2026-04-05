"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { RefreshCw, TrendingUp, Users, Calendar, IndianRupee, Pill, Star, MessageSquare, Ticket } from "lucide-react";
import { format, subDays } from "date-fns";
import toast from "react-hot-toast";

export default function AdminAnalytics() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [patients, appointments, invoices, pharmBills, reviews, tokens, messages] = await Promise.all([
        getDocs(collection(db, "patients")),
        getDocs(collection(db, "appointments")),
        getDocs(collection(db, "invoices")),
        getDocs(collection(db, "pharmacyBills")),
        getDocs(collection(db, "reviews")),
        getDocs(query(collection(db, "queue/" + format(new Date(), "yyyy-MM-dd") + "/tokens"))),
        getDocs(collection(db, "contactMessages")),
      ]);

      // Revenue calculations
      const invoiceTotal = invoices.docs.reduce((s, d) => s + (d.data().total || 0), 0);
      const pharmTotal = pharmBills.docs.reduce((s, d) => s + (d.data().total || 0), 0);

      // Patient source breakdown
      const sources = { portal: 0, manual: 0, token: 0, card: 0, seed: 0 };
      patients.docs.forEach((d) => { const s = d.data().source || "manual"; (sources as any)[s] = ((sources as any)[s] || 0) + 1; });

      // Appointment status breakdown
      const apptStatus: Record<string, number> = {};
      appointments.docs.forEach((d) => { const s = d.data().status || "pending"; apptStatus[s] = (apptStatus[s] || 0) + 1; });

      // Review ratings
      const ratings = [0, 0, 0, 0, 0]; // index = rating-1
      reviews.docs.forEach((d) => { const r = d.data().rating; if (r >= 1 && r <= 5) ratings[r - 1]++; });
      const avgRating = reviews.size > 0 ? (reviews.docs.reduce((s, d) => s + (d.data().rating || 0), 0) / reviews.size).toFixed(1) : "—";

      // Last 7 days patients
      const last7 = Array.from({ length: 7 }, (_, i) => {
        const date = format(subDays(new Date(), 6 - i), "MMM d");
        const count = patients.docs.filter((d) => {
          const created = d.data().createdAt?.toDate?.();
          return created && format(created, "MMM d") === date;
        }).length;
        return { date, count };
      });

      setData({ patients: patients.size, appointments: appointments.size, invoiceTotal, pharmTotal, reviews: reviews.size, avgRating, tokensToday: tokens.size, messages: messages.size, sources, apptStatus, last7, ratings });
    } catch (err) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <p className="text-2xl font-bold text-foreground">{loading ? "—" : value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <button onClick={load} className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Patients" value={data.patients} color="bg-blue-100 text-blue-600" />
        <StatCard icon={Calendar} label="Appointments" value={data.appointments} color="bg-purple-100 text-purple-600" />
        <StatCard icon={IndianRupee} label="Hospital Revenue" value={data.invoiceTotal ? `₹${data.invoiceTotal.toFixed(0)}` : "₹0"} color="bg-green-100 text-green-600" />
        <StatCard icon={Pill} label="Pharmacy Revenue" value={data.pharmTotal ? `₹${data.pharmTotal.toFixed(0)}` : "₹0"} color="bg-cyan-100 text-cyan-600" />
        <StatCard icon={Star} label="Reviews" value={`${data.reviews || 0} (⭐${data.avgRating || "—"})`} color="bg-amber-100 text-amber-600" />
        <StatCard icon={Ticket} label="Tokens Today" value={data.tokensToday || 0} color="bg-indigo-100 text-indigo-600" />
        <StatCard icon={MessageSquare} label="Messages" value={data.messages || 0} color="bg-pink-100 text-pink-600" />
        <StatCard icon={TrendingUp} label="Total Revenue" value={data.invoiceTotal && data.pharmTotal ? `₹${(data.invoiceTotal + data.pharmTotal).toFixed(0)}` : "₹0"} color="bg-emerald-100 text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Patient sources */}
        {data.sources && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-3">Patient Sources</h3>
            <div className="space-y-2">
              {Object.entries(data.sources).filter(([, v]) => (v as number) > 0).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{k}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round(((v as number) / (data.patients || 1)) * 100)}%` }} />
                    </div>
                    <span className="font-medium text-foreground w-6 text-right">{v as number}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointment status */}
        {data.apptStatus && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-3">Appointments by Status</h3>
            <div className="space-y-2">
              {Object.entries(data.apptStatus).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{k}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    k === "confirmed" ? "bg-green-100 text-green-700" :
                    k === "pending" ? "bg-yellow-100 text-yellow-700" :
                    k === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>{v as number}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating distribution */}
        {data.ratings && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-3">Review Ratings</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground w-8">{stars}★</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: data.reviews > 0 ? `${((data.ratings[stars - 1] || 0) / data.reviews) * 100}%` : "0%" }} />
                  </div>
                  <span className="text-muted-foreground w-4 text-right">{data.ratings[stars - 1] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Last 7 days patient registrations */}
      {data.last7 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4">New Patients — Last 7 Days</h3>
          <div className="flex items-end gap-2 h-24">
            {data.last7.map((d: any) => {
              const max = Math.max(...data.last7.map((x: any) => x.count), 1);
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{d.count || ""}</span>
                  <div className="w-full bg-primary/10 rounded-t" style={{ height: `${Math.max(4, (d.count / max) * 80)}px`, background: d.count > 0 ? "rgb(30,58,95)" : undefined }} />
                  <span className="text-[10px] text-muted-foreground">{d.date}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

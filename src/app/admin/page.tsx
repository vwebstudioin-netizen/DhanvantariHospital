"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Calendar, Users, MessageSquare, Star, Ticket,
  IndianRupee, Pill, RefreshCw,
} from "lucide-react";
import { format, startOfMonth, startOfYear, subMonths, subDays } from "date-fns";

type Period = "today" | "monthly" | "quarterly" | "yearly";

const PERIODS: { id: Period; label: string }[] = [
  { id: "today",     label: "Today" },
  { id: "monthly",   label: "This Month" },
  { id: "quarterly", label: "Quarterly" },
  { id: "yearly",    label: "This Year" },
];

function periodStart(period: Period): Date {
  const now = new Date();
  switch (period) {
    case "today":     return new Date(now.setHours(0, 0, 0, 0));
    case "monthly":   return startOfMonth(now);
    case "quarterly": return subMonths(now, 3);
    case "yearly":    return startOfYear(now);
  }
}

function inPeriod(ts: any, period: Period): boolean {
  const date = ts?.toDate?.();
  if (!date) return false;
  return date >= periodStart(period);
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [loading, setLoading] = useState(true);

  // All-time data (fetched once)
  const [allInvoices,  setAllInvoices]  = useState<any[]>([]);
  const [allBills,     setAllBills]     = useState<any[]>([]);
  const [allAppts,     setAllAppts]     = useState<any[]>([]);
  const [allPatients,  setAllPatients]  = useState<any[]>([]);
  const [allTokens,    setAllTokens]    = useState<number>(0);

  // Always-totals (unaffected by period filter)
  const [unreadMsgs,   setUnreadMsgs]   = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");

      const [invSnap, billSnap, apptSnap, patSnap, tokenSnap, msgSnap, reviewSnap, recentSnap] =
        await Promise.all([
          getDocs(collection(db, "invoices")),
          getDocs(collection(db, "pharmacyBills")),
          getDocs(collection(db, "appointments")),
          getDocs(collection(db, "patients")),
          getDocs(collection(db, `queue/${today}/tokens`)),
          getDocs(collection(db, "contactMessages")),
          getDocs(collection(db, "reviews")),
          getDocs(query(collection(db, "contactMessages"), orderBy("createdAt", "desc"), limit(5))),
        ]);

      setAllInvoices(invSnap.docs.map(d => d.data()));
      setAllBills(billSnap.docs.map(d => d.data()));
      setAllAppts(apptSnap.docs.map(d => d.data()));
      setAllPatients(patSnap.docs.map(d => d.data()));
      setAllTokens(tokenSnap.size);
      setUnreadMsgs(msgSnap.docs.filter(d => !d.data().isRead).length);
      setPendingReviews(reviewSnap.docs.filter(d => d.data().status === "pending").length);
      setRecentActivity(recentSnap.docs.map(d => ({
        id: d.id,
        text: d.data().messageType === "appointment"
          ? `Appointment from ${d.data().name} — ${d.data().date || ""} ${d.data().time || ""}`
          : `Message from ${d.data().name}: ${d.data().subject || d.data().message?.slice(0, 50)}`,
        time: d.data().createdAt?.toDate?.()?.toLocaleString("en-IN") || "—",
        isRead: d.data().isRead,
      })));
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Derived stats for selected period
  const filteredInvoices = allInvoices.filter(d => inPeriod(d.createdAt, period));
  const filteredBills    = allBills.filter(d => inPeriod(d.createdAt, period));
  const filteredAppts    = allAppts.filter(d => {
    // appointments have a `date` string field (YYYY-MM-DD), also check createdAt
    const dateStr = d.date;
    if (dateStr) return new Date(dateStr) >= periodStart(period);
    return inPeriod(d.createdAt, period);
  });
  const filteredPatients = allPatients.filter(d => inPeriod(d.createdAt, period));

  const revenue  = filteredInvoices.reduce((s, d) => s + (d.total || 0), 0)
                 + filteredBills.reduce((s, d) => s + (d.total || 0), 0);
  const hospRev  = filteredInvoices.reduce((s, d) => s + (d.total || 0), 0);
  const pharmRev = filteredBills.reduce((s, d) => s + (d.total || 0), 0);

  const periodLabel = PERIODS.find(p => p.id === period)?.label ?? "";

  const stats = [
    { label: `${periodLabel} Revenue`,        value: `₹${revenue.toLocaleString("en-IN")}`,     icon: IndianRupee,  color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: `Hospital Revenue`,              value: `₹${hospRev.toLocaleString("en-IN")}`,     icon: IndianRupee,  color: "text-teal-600",    bg: "bg-teal-50"    },
    { label: `Pharmacy Revenue`,              value: `₹${pharmRev.toLocaleString("en-IN")}`,    icon: Pill,         color: "text-cyan-600",    bg: "bg-cyan-50"    },
    { label: `New Patients`,                  value: filteredPatients.length,                    icon: Users,        color: "text-blue-600",    bg: "bg-blue-50"    },
    { label: `Appointments`,                  value: filteredAppts.length,                       icon: Calendar,     color: "text-purple-600",  bg: "bg-purple-50"  },
    { label: `Queue Today`,                   value: allTokens,                                  icon: Ticket,       color: "text-green-600",   bg: "bg-green-50"   },
    { label: `Pending Reviews`,               value: pendingReviews,                             icon: Star,         color: "text-orange-500",  bg: "bg-orange-50"  },
    { label: `Unread Messages`,               value: unreadMsgs,                                 icon: MessageSquare,color: "text-amber-600",   bg: "bg-amber-50"   },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? "Loading…" : `${allPatients.length} total patients · ${allInvoices.length + allBills.length} total invoices`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Period filter */}
          <div className="flex bg-muted rounded-lg p-1 gap-0.5">
            {PERIODS.map(p => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  period === p.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={load}
            className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse h-24" />
            ))
          : stats.map(stat => (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
                <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
      </div>

      {/* Period note */}
      {!loading && (
        <p className="text-xs text-muted-foreground">
          Revenue, new patients, and appointments filtered for: <strong>{periodLabel}</strong>.
          Queue and messages always show live counts.
        </p>
      )}

      {/* Recent activity */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Recent Enquiries</h2>
        </div>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">Loading…</div>
        ) : recentActivity.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No recent activity. Load demo data from Settings to see examples.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentActivity.map(item => (
              <div key={item.id}
                className={`px-5 py-3 flex items-start justify-between gap-4 ${!item.isRead ? "bg-blue-50/50" : ""}`}>
                <p className="text-sm text-foreground">{item.text}</p>
                <p className="text-xs text-muted-foreground shrink-0">{item.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

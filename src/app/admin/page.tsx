"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Calendar, Users, MessageSquare, Star, Ticket, IndianRupee, Pill, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface Stat { label: string; value: string | number; icon: any; color: string; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");

      const [apptSnap, patientSnap, msgSnap, reviewSnap, tokenSnap, invoiceSnap, billSnap] = await Promise.all([
        getDocs(collection(db, "appointments")),
        getDocs(collection(db, "patients")),
        getDocs(query(collection(db, "contactMessages"), where("isRead", "==", false))),
        getDocs(query(collection(db, "reviews"), where("status", "==", "pending"))),
        getDocs(collection(db, `queue/${today}/tokens`)),
        getDocs(collection(db, "invoices")),
        getDocs(collection(db, "pharmacyBills")),
      ]);

      // Today's revenue from invoices + pharmacy bills
      const todayInvoices = invoiceSnap.docs
        .filter((d) => d.data().createdAt?.toDate?.()?.toDateString() === new Date().toDateString())
        .reduce((s, d) => s + (d.data().total || 0), 0);
      const todayBills = billSnap.docs
        .filter((d) => d.data().createdAt?.toDate?.()?.toDateString() === new Date().toDateString())
        .reduce((s, d) => s + (d.data().total || 0), 0);

      setStats([
        { label: "Total Patients", value: patientSnap.size, icon: Users, color: "text-blue-600" },
        { label: "Total Appointments", value: apptSnap.size, icon: Calendar, color: "text-purple-600" },
        { label: "Unread Messages", value: msgSnap.size, icon: MessageSquare, color: "text-amber-600" },
        { label: "Pending Reviews", value: reviewSnap.size, icon: Star, color: "text-orange-500" },
        { label: "Queue Today", value: tokenSnap.size, icon: Ticket, color: "text-green-600" },
        { label: "Today's Revenue", value: `₹${(todayInvoices + todayBills).toFixed(0)}`, icon: IndianRupee, color: "text-emerald-600" },
        { label: "Total Invoices", value: invoiceSnap.size, icon: IndianRupee, color: "text-teal-600" },
        { label: "Pharmacy Bills", value: billSnap.size, icon: Pill, color: "text-cyan-600" },
      ]);

      // Recent activity from contact messages
      const recentMsgs = await getDocs(query(collection(db, "contactMessages"), orderBy("createdAt", "desc"), limit(5)));
      setRecentActivity(recentMsgs.docs.map((d) => ({
        id: d.id,
        text: d.data().messageType === "appointment"
          ? `Appointment request from ${d.data().name} — ${d.data().date || ""} ${d.data().time || ""}`
          : `Contact message from ${d.data().name}: ${d.data().subject || d.data().message?.slice(0, 50)}`,
        time: d.data().createdAt?.toDate?.()?.toLocaleString("en-IN") || "—",
        isRead: d.data().isRead,
      })));
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <button onClick={load} className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse h-24" />
          ))
        ) : stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Recent Enquiries</h2>
        </div>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : recentActivity.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No recent activity. Seed demo data to see examples.</div>
        ) : (
          <div className="divide-y divide-border">
            {recentActivity.map((item) => (
              <div key={item.id} className={`px-5 py-3 flex items-start justify-between gap-4 ${!item.isRead ? "bg-blue-50/50" : ""}`}>
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

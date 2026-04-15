"use client";

import { useState, useEffect } from "react";
import {
  collection, addDoc, getDocs, updateDoc, doc,
  orderBy, query, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Calendar, Plus, Search, Building2, User, Phone, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

// ── Types ────────────────────────────────────────────────────────────────────

type AppointmentType = "patient" | "mr";
type AppointmentStatus = "pending" | "confirmed" | "arrived" | "completed" | "cancelled";

interface Appointment {
  id: string;
  type: AppointmentType;
  // Patient appointments
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  departmentSlug?: string;
  serviceSlug?: string;
  doctorSlug?: string;
  // MR/Visitor appointments
  visitorName?: string;
  company?: string;
  visitorPhone?: string;
  meetingWith?: string;
  purpose?: string;
  // Common
  date: string;
  time: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: any;
}

const PURPOSES = [
  "Medicine Demo / Presentation",
  "New Product Introduction",
  "Sample Collection",
  "Order Discussion",
  "Hospital Visit / Courtesy Call",
  "Equipment Demo",
  "Tender / Contract Discussion",
  "Other",
];

const DOCTORS = [
  "Dr. Ayyapa",
  "General Medicine Specialist",
  "Surgeon",
  "Gynecologist",
  "Pulmonologist",
  "Urologist",
  "Nephrologist",
  "Orthopedic Surgeon",
  "Neurologist",
  "Cardiologist",
  "Pharmacist",
  "Hospital Administrator",
];

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM",
];

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string }> = {
  pending:   { label: "Pending",   color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700" },
  arrived:   { label: "Arrived",   color: "bg-purple-100 text-purple-700" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | AppointmentType>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | AppointmentStatus>("all");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formType, setFormType] = useState<AppointmentType>("mr");

  const [mrForm, setMrForm] = useState({
    visitorName: "", company: "", visitorPhone: "", meetingWith: DOCTORS[0],
    purpose: PURPOSES[0], date: format(new Date(), "yyyy-MM-dd"),
    time: "10:00 AM", notes: "",
  });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setAppointments(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Appointment[]);
    } catch { toast.error("Failed to load appointments"); }
    finally { setLoading(false); }
  }

  const handleCreateMR = async () => {
    if (!mrForm.visitorName || !mrForm.company || !mrForm.date) {
      toast.error("Visitor name, company and date are required"); return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, "appointments"), {
        type: "mr",
        ...mrForm,
        status: "confirmed",
        createdAt: Timestamp.now(),
      });
      toast.success("Appointment scheduled!");
      setShowForm(false);
      setMrForm({ visitorName: "", company: "", visitorPhone: "", meetingWith: DOCTORS[0], purpose: PURPOSES[0], date: format(new Date(), "yyyy-MM-dd"), time: "10:00 AM", notes: "" });
      load();
    } catch { toast.error("Failed to create appointment"); }
    finally { setSaving(false); }
  };

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    try {
      await updateDoc(doc(db, "appointments", id), { status });
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
      toast.success(`Status updated to ${STATUS_CONFIG[status].label}`);
    } catch { toast.error("Failed to update status"); }
  };

  const filtered = appointments.filter((a) => {
    const name = a.type === "mr" ? a.visitorName : a.patientName;
    const matchSearch = !search || name?.toLowerCase().includes(search.toLowerCase()) ||
      a.company?.toLowerCase().includes(search.toLowerCase()) ||
      a.date?.includes(search);
    const matchType = filterType === "all" || a.type === filterType;
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Patient appointments + Medical Rep / Visitor visits
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => { setShowForm(!showForm); setFormType("mr"); }}
            className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
            <Plus className="w-4 h-4" /> Schedule Visit
          </button>
        </div>
      </div>

      {/* Create MR Appointment Form */}
      {showForm && formType === "mr" && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Schedule Medical Representative / Visitor Visit</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Visitor Name *", key: "visitorName", placeholder: "Full name" },
              { label: "Company / Organisation *", key: "company", placeholder: "e.g. Sun Pharma, Cipla" },
              { label: "Phone", key: "visitorPhone", placeholder: "9876543210" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                <input value={(mrForm as any)[f.key]} onChange={(e) => setMrForm({ ...mrForm, [f.key]: e.target.value })} placeholder={f.placeholder}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Meeting With *</label>
              <select value={mrForm.meetingWith} onChange={(e) => setMrForm({ ...mrForm, meetingWith: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {DOCTORS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Purpose *</label>
              <select value={mrForm.purpose} onChange={(e) => setMrForm({ ...mrForm, purpose: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Date *</label>
              <input type="date" value={mrForm.date} onChange={(e) => setMrForm({ ...mrForm, date: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Time *</label>
              <select value={mrForm.time} onChange={(e) => setMrForm({ ...mrForm, time: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Notes</label>
              <input value={mrForm.notes} onChange={(e) => setMrForm({ ...mrForm, notes: e.target.value })} placeholder="Additional notes (optional)"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreateMR} disabled={saving}
              className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-50">
              {saving ? "Scheduling..." : "Schedule Visit"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm font-medium text-muted-foreground border border-border hover:bg-muted">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, company..."
            className="w-full pl-9 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none">
          <option value="all">All Types</option>
          <option value="patient">Patient</option>
          <option value="mr">MR / Visitor</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="arrived">Arrived</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading appointments...</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name / Company</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Purpose / Service</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date & Time</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">
                  No appointments found. <button onClick={() => setShowForm(true)} className="text-primary hover:underline">Schedule a visit</button>
                </td></tr>
              ) : filtered.map((appt) => {
                const isMR = appt.type === "mr";
                const config = STATUS_CONFIG[appt.status];
                return (
                  <tr key={appt.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${isMR ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                        {isMR ? "MR" : "Patient"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isMR ? <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                        <div>
                          <p className="font-medium text-foreground">{isMR ? appt.visitorName : appt.patientName}</p>
                          <p className="text-xs text-muted-foreground">
                            {isMR ? `${appt.company} · ${appt.meetingWith}` : appt.patientPhone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">
                      {isMR ? appt.purpose : appt.serviceSlug || appt.departmentSlug || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-foreground">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs">{appt.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{appt.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.color}`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {appt.status === "confirmed" && (
                          <button onClick={() => handleStatusChange(appt.id, "arrived")}
                            className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded hover:bg-purple-100">
                            Arrived
                          </button>
                        )}
                        {(appt.status === "arrived" || appt.status === "confirmed") && (
                          <button onClick={() => handleStatusChange(appt.id, "completed")}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded hover:bg-green-100">
                            <CheckCircle className="w-3 h-3" /> Done
                          </button>
                        )}
                        {!["completed", "cancelled"].includes(appt.status) && (
                          <button onClick={() => handleStatusChange(appt.id, "cancelled")}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded hover:bg-red-100">
                            <XCircle className="w-3 h-3" /> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

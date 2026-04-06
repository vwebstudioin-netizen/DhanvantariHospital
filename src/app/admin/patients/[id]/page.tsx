"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc, getDoc, deleteDoc, collection, getDocs, query, where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthContext } from "@/providers/AuthProvider";
import {
  ArrowLeft, User, Phone, Mail, Droplets, Calendar, CreditCard,
  Receipt, Pill, FileText, Activity, IndianRupee, Stethoscope, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Patient {
  id: string; name: string; email?: string; phone?: string;
  dateOfBirth?: string; bloodGroup?: string; address?: string;
  source?: string; visitCount?: number; createdAt?: any;
}
interface Card {
  id: string; cardNumber: string; type: string; patientName: string;
  doctorName: string; ward?: string; roomNumber?: string; diagnosis: string;
  admissionDate: string; isActive: boolean; createdAt?: any;
}
interface Invoice {
  id: string; invoiceNumber: string; items: any[]; total: number;
  paymentStatus: string; paymentMethod: string; createdAt?: any;
}
interface PharmaBill {
  id: string; billNumber: string; items: any[]; total: number;
  paymentStatus: string; paymentMethod: string; createdAt?: any;
}
interface Appointment {
  id: string; type: string; patientName?: string; visitorName?: string;
  date: string; time: string; status: string;
  departmentSlug?: string; serviceSlug?: string; doctorSlug?: string;
  purpose?: string; createdAt?: any;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (ts: any) =>
  ts?.toDate?.()?.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) ?? "—";

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-100 text-green-700", pending: "bg-amber-100 text-amber-700",
  partial: "bg-blue-100 text-blue-700",
  confirmed: "bg-blue-100 text-blue-700", completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700", arrived: "bg-purple-100 text-purple-700",
};

const TABS = [
  { id: "cards",   label: "IPD / OPD Cards",   icon: CreditCard },
  { id: "bills",   label: "Hospital Bills",     icon: Receipt },
  { id: "pharma",  label: "Pharmacy Bills",     icon: Pill },
  { id: "appts",   label: "Appointments",       icon: Calendar },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { isAdmin } = useAuthContext();

  const [patient, setPatient]     = useState<Patient | null>(null);
  const [cards, setCards]         = useState<Card[]>([]);
  const [invoices, setInvoices]   = useState<Invoice[]>([]);
  const [pharma, setPharma]       = useState<PharmaBill[]>([]);
  const [appts, setAppts]         = useState<Appointment[]>([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState("cards");

  const handleDelete = async () => {
    if (!patient) return;
    if (!window.confirm(`Delete patient "${patient.name}"? This only removes the patient record — linked invoices and cards are not deleted.`)) return;
    try {
      await deleteDoc(doc(db, "patients", id));
      toast.success("Patient deleted");
      router.back();
    } catch { toast.error("Failed to delete patient"); }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // 1. Load patient
        const patSnap = await getDoc(doc(db, "patients", id));
        if (!patSnap.exists()) { setLoading(false); return; }
        const pat = { id: patSnap.id, ...patSnap.data() } as Patient;
        setPatient(pat);

        const phone = pat.phone?.trim();
        if (!phone) { setLoading(false); return; }

        // 2. Parallel queries — use allSettled so one failure doesn't blank all tabs
        const byDate = (a: any, b: any) =>
          (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0);

        const [cardRes, invRes, pharmaRes, apptRes] = await Promise.allSettled([
          getDocs(query(collection(db, "inpatientCards"), where("patientPhone", "==", phone))),
          getDocs(query(collection(db, "invoices"),       where("patientPhone", "==", phone))),
          getDocs(query(collection(db, "pharmacyBills"),  where("patientPhone", "==", phone))),
          getDocs(query(collection(db, "appointments"),   where("patientPhone", "==", phone))),
        ]);

        if (cardRes.status === "fulfilled")
          setCards(cardRes.value.docs.map(d => ({ id: d.id, ...d.data() } as Card)).sort(byDate));
        if (invRes.status === "fulfilled")
          setInvoices(invRes.value.docs.map(d => ({ id: d.id, ...d.data() } as Invoice)).sort(byDate));
        if (pharmaRes.status === "fulfilled")
          setPharma(pharmaRes.value.docs.map(d => ({ id: d.id, ...d.data() } as PharmaBill)).sort(byDate));
        if (apptRes.status === "fulfilled")
          setAppts(apptRes.value.docs.map(d => ({ id: d.id, ...d.data() } as Appointment)).sort(byDate));

        // Log any failures to console for debugging
        [cardRes, invRes, pharmaRes, apptRes].forEach((r, i) => {
          if (r.status === "rejected")
            console.warn(`Patient detail query [${i}] failed:`, r.reason?.message);
        });
      } catch (e) {
        console.error("Patient detail load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        Loading patient records…
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground">Patient not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-sm text-primary hover:underline">← Go back</button>
      </div>
    );
  }

  const totalHospital = invoices.reduce((s, i) => s + (i.total || 0), 0);
  const totalPharma   = pharma.reduce((s, b) => s + (b.total || 0), 0);
  const activeCards   = cards.filter(c => c.isActive).length;
  const upcomingAppts = appts.filter(a => a.status === "confirmed" || a.status === "pending").length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back + Admin delete */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Patients
        </button>
        {isAdmin && (
          <button onClick={handleDelete}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Delete Patient
          </button>
        )}
      </div>

      {/* Patient Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-foreground">{patient.name}</h1>
              {patient.source && (
                <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full", {
                  "bg-blue-100 text-blue-700": patient.source === "portal",
                  "bg-green-100 text-green-700": patient.source === "manual",
                  "bg-gray-100 text-gray-600": !["portal","manual"].includes(patient.source),
                })}>
                  {patient.source === "portal" ? "Portal" : patient.source === "manual" ? "Manual" : patient.source}
                </span>
              )}
              {patient.bloodGroup && (
                <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs font-bold rounded-full">
                  {patient.bloodGroup}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              {patient.phone && (
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{patient.phone}</span>
              )}
              {patient.email && (
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{patient.email}</span>
              )}
              {patient.dateOfBirth && (
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />DOB: {patient.dateOfBirth}</span>
              )}
              {patient.address && (
                <span className="text-xs">{patient.address}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered {fmt(patient.createdAt)} · {patient.visitCount ?? 0} visit{(patient.visitCount ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-border">
          {[
            { label: "Hospital Spend", value: `₹${totalHospital.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-blue-600 bg-blue-50" },
            { label: "Pharmacy Spend", value: `₹${totalPharma.toLocaleString("en-IN")}`, icon: Pill, color: "text-purple-600 bg-purple-50" },
            { label: "Active Cards", value: activeCards, icon: CreditCard, color: "text-green-600 bg-green-50" },
            { label: "Pending Appts", value: upcomingAppts, icon: Calendar, color: "text-amber-600 bg-amber-50" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", s.color)}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* No phone warning */}
      {!patient.phone && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
          This patient has no phone number — linked records cannot be fetched. Add a phone number to see full history.
        </div>
      )}

      {/* Tabs */}
      {patient.phone && (
        <div className="space-y-4">
          <div className="flex gap-1 bg-muted rounded-xl p-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-1 justify-center",
                  tab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <t.icon className="w-4 h-4 shrink-0" />
                {t.label}
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-semibold",
                  tab === t.id ? "bg-primary/10 text-primary" : "bg-muted-foreground/10 text-muted-foreground"
                )}>
                  {t.id === "cards" ? cards.length : t.id === "bills" ? invoices.length : t.id === "pharma" ? pharma.length : appts.length}
                </span>
              </button>
            ))}
          </div>

          {/* ── In-Patient Cards ──────────────────────────────────────────────── */}
          {tab === "cards" && (
            <TabPanel empty={cards.length === 0} emptyMsg="No IPD/OPD cards found for this patient.">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <Th>Card #</Th>
                    <Th>Type</Th>
                    <Th>Doctor</Th>
                    <Th cls="hidden sm:table-cell">Ward / Room</Th>
                    <Th cls="hidden md:table-cell">Diagnosis</Th>
                    <Th>Admitted</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((c) => (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">{c.cardNumber}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 text-xs font-semibold rounded-full",
                          c.type === "room" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                        )}>
                          {c.type === "room" ? "IPD" : "OPD"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{c.doctorName}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                        {c.ward || "—"}{c.roomNumber ? ` / ${c.roomNumber}` : ""}
                      </td>
                      <td className="px-4 py-3 text-xs hidden md:table-cell max-w-40 truncate">{c.diagnosis}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{c.admissionDate || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 text-xs font-semibold rounded-full",
                          c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        )}>
                          {c.isActive ? "Active" : "Closed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
          )}

          {/* ── Hospital Bills ────────────────────────────────────────────────── */}
          {tab === "bills" && (
            <TabPanel empty={invoices.length === 0} emptyMsg="No hospital invoices found for this patient.">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <Th>Invoice #</Th>
                    <Th cls="hidden sm:table-cell">Items</Th>
                    <Th>Amount</Th>
                    <Th>Payment</Th>
                    <Th>Date</Th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">{inv.invoiceNumber}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                        {inv.items?.length ?? 0} item{inv.items?.length !== 1 ? "s" : ""}
                      </td>
                      <td className="px-4 py-3 font-semibold">₹{(inv.total ?? 0).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 text-xs font-semibold rounded-full",
                          STATUS_COLORS[inv.paymentStatus] ?? "bg-gray-100 text-gray-600"
                        )}>
                          {inv.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{fmt(inv.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-border bg-muted/30 flex justify-between text-sm">
                <span className="text-muted-foreground">Total hospital spend</span>
                <span className="font-bold text-foreground">₹{totalHospital.toLocaleString("en-IN")}</span>
              </div>
            </TabPanel>
          )}

          {/* ── Pharmacy Bills ───────────────────────────────────────────────── */}
          {tab === "pharma" && (
            <TabPanel empty={pharma.length === 0} emptyMsg="No pharmacy bills found for this patient.">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <Th>Bill #</Th>
                    <Th cls="hidden sm:table-cell">Medicines</Th>
                    <Th>Amount</Th>
                    <Th>Payment</Th>
                    <Th>Date</Th>
                  </tr>
                </thead>
                <tbody>
                  {pharma.map((b) => (
                    <tr key={b.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">{b.billNumber}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                        {b.items?.length ?? 0} item{b.items?.length !== 1 ? "s" : ""}
                      </td>
                      <td className="px-4 py-3 font-semibold">₹{(b.total ?? 0).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 text-xs font-semibold rounded-full",
                          STATUS_COLORS[b.paymentStatus] ?? "bg-gray-100 text-gray-600"
                        )}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{fmt(b.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-border bg-muted/30 flex justify-between text-sm">
                <span className="text-muted-foreground">Total pharmacy spend</span>
                <span className="font-bold text-foreground">₹{totalPharma.toLocaleString("en-IN")}</span>
              </div>
            </TabPanel>
          )}

          {/* ── Appointments ─────────────────────────────────────────────────── */}
          {tab === "appts" && (
            <TabPanel empty={appts.length === 0} emptyMsg="No appointments found for this patient.">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <Th>Type</Th>
                    <Th>Date & Time</Th>
                    <Th cls="hidden sm:table-cell">Department / Service</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {appts.map((a) => (
                    <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 text-xs font-semibold rounded-full",
                          a.type === "mr" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {a.type === "mr" ? "MR Visit" : "Patient"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <p className="font-medium">{a.date}</p>
                        <p className="text-muted-foreground">{a.time}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                        {a.departmentSlug?.replace(/-/g, " ") || a.purpose || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 text-xs font-semibold rounded-full capitalize",
                          STATUS_COLORS[a.status] ?? "bg-gray-100 text-gray-600"
                        )}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Th({ children, cls = "" }: { children: React.ReactNode; cls?: string }) {
  return (
    <th className={cn("text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider", cls)}>
      {children}
    </th>
  );
}

function TabPanel({ children, empty, emptyMsg }: { children: React.ReactNode; empty: boolean; emptyMsg: string }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {empty ? (
        <div className="flex flex-col items-center justify-center py-14 text-muted-foreground gap-2">
          <Activity className="w-8 h-8 opacity-30" />
          <p className="text-sm">{emptyMsg}</p>
        </div>
      ) : children}
    </div>
  );
}

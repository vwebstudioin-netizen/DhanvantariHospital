"use client";

import { useState, useEffect } from "react";
import {
  collection, getDocs, updateDoc, doc,
  orderBy, query, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Inbox, Phone, Calendar, Clock, RefreshCw, CheckCircle, XCircle, User } from "lucide-react";
import toast from "react-hot-toast";

type EnquiryStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface Enquiry {
  id: string;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  departmentSlug?: string;
  serviceSlug?: string;
  doctorSlug?: string;
  date: string;
  time: string;
  notes?: string;
  status: EnquiryStatus;
  isNewPatient?: boolean;
  createdAt: any;
  type?: string;
}

const STATUS_CONFIG: Record<EnquiryStatus, { label: string; color: string }> = {
  pending:   { label: "New",       color: "bg-blue-100 text-blue-700" },
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700" },
  completed: { label: "Done",      color: "bg-gray-100 text-gray-600" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | EnquiryStatus>("pending");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      // Only show patient bookings (type "patient" or no type — not MR visits)
      const all = snap.docs
        .map((d) => ({ id: d.id, ...d.data() })) as Enquiry[];
      setEnquiries(all.filter((e) => !e.type || e.type === "patient"));
    } catch {
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  }

  const handleStatus = async (id: string, status: EnquiryStatus) => {
    try {
      await updateDoc(doc(db, "appointments", id), { status });
      setEnquiries((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
      toast.success(`Marked as ${STATUS_CONFIG[status].label}`);
    } catch {
      toast.error("Update failed");
    }
  };

  const filtered = filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);
  const newCount = enquiries.filter((e) => e.status === "pending").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Inbox className="w-5 h-5" />
            Appointment Enquiries
            {newCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">{newCount} new</span>
            )}
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">Patient bookings from the website</p>
        </div>
        <button onClick={load} className="p-2 text-slate-400 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {[
          { key: "pending", label: `New (${enquiries.filter(e => e.status === "pending").length})` },
          { key: "confirmed", label: "Confirmed" },
          { key: "all", label: "All" },
          { key: "completed", label: "Done" },
          { key: "cancelled", label: "Cancelled" },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key as any)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === tab.key
                ? "bg-[#1e3a5f] text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Enquiry cards */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading enquiries...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          {filter === "pending" ? "No new enquiries. All caught up! 🎉" : "No enquiries in this category."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((enq) => {
            const config = STATUS_CONFIG[enq.status || "pending"];
            return (
              <div key={enq.id} className={`bg-white rounded-xl border p-4 ${enq.status === "pending" ? "border-blue-200 border-l-4 border-l-blue-500" : "border-slate-100"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {enq.patientName}
                      </span>
                      {enq.isNewPatient && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 rounded-full">New Patient</span>
                      )}
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.color}`}>
                        {config.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                      {enq.patientPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {enq.patientPhone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {enq.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {enq.time}
                      </span>
                      {enq.departmentSlug && (
                        <span className="capitalize">{enq.departmentSlug.replace(/-/g, " ")}</span>
                      )}
                    </div>

                    {enq.notes && (
                      <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 rounded p-2">{enq.notes}</p>
                    )}

                    <p className="text-[10px] text-slate-400 mt-1.5">
                      Received: {enq.createdAt?.toDate?.()?.toLocaleString("en-IN") || "—"}
                      {enq.patientEmail && ` · ${enq.patientEmail}`}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    {enq.status === "pending" && (
                      <button onClick={() => handleStatus(enq.id, "confirmed")}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100">
                        <CheckCircle className="w-3.5 h-3.5" /> Confirm
                      </button>
                    )}
                    {enq.status === "confirmed" && (
                      <button onClick={() => handleStatus(enq.id, "completed")}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                        <CheckCircle className="w-3.5 h-3.5" /> Done
                      </button>
                    )}
                    {!["completed", "cancelled"].includes(enq.status) && (
                      <button onClick={() => handleStatus(enq.id, "cancelled")}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
                        <XCircle className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

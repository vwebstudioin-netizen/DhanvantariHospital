"use client";

import { useState, useEffect } from "react";
import {
  collection, getDocs, updateDoc, doc, orderBy, query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Inbox, Phone, Calendar, Clock, RefreshCw, CheckCircle, XCircle, User, MessageSquare, Mail } from "lucide-react";
import toast from "react-hot-toast";

type EnquiryStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface Appointment {
  id: string; patientName: string; patientEmail?: string; patientPhone?: string;
  departmentSlug?: string; serviceSlug?: string; date: string; time: string;
  notes?: string; status: EnquiryStatus; isNewPatient?: boolean; createdAt: any; type?: string;
}

interface ContactMessage {
  id: string; name: string; email: string; phone?: string;
  subject?: string; message: string; isRead?: boolean; createdAt: any;
}

const STATUS_CONFIG: Record<EnquiryStatus, { label: string; color: string }> = {
  pending:   { label: "New",       color: "bg-blue-100 text-blue-700" },
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700" },
  completed: { label: "Done",      color: "bg-gray-100 text-gray-600" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
};

export default function EnquiriesPage() {
  const [tab, setTab] = useState<"appointments" | "messages">("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [apptFilter, setApptFilter] = useState<"all" | EnquiryStatus>("pending");

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [apptSnap, msgSnap] = await Promise.all([
        getDocs(query(collection(db, "appointments"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "contactMessages"), orderBy("createdAt", "desc"))),
      ]);
      const allAppts = apptSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment);
      setAppointments(allAppts.filter((e) => !e.type || e.type === "patient"));
      setMessages(msgSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as ContactMessage[]);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  }

  const handleStatus = async (id: string, status: EnquiryStatus) => {
    try {
      await updateDoc(doc(db, "appointments", id), { status });
      setAppointments((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
      toast.success(`Marked as ${STATUS_CONFIG[status].label}`);
    } catch { toast.error("Update failed"); }
  };

  const markRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "contactMessages", id), { isRead: true });
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, isRead: true } : m));
    } catch { /* ignore */ }
  };

  const newAppts = appointments.filter((e) => e.status === "pending").length;
  const unreadMsgs = messages.filter((m) => !m.isRead).length;
  const filteredAppts = apptFilter === "all" ? appointments : appointments.filter((e) => e.status === apptFilter);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Inbox className="w-5 h-5" /> Enquiries
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">Patient bookings & contact messages from the website</p>
        </div>
        <button onClick={loadAll} className="p-2 text-slate-400 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        <button onClick={() => setTab("appointments")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${tab === "appointments" ? "bg-[#1e3a5f] text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
          <Calendar className="w-4 h-4" />
          Appointments
          {newAppts > 0 && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-500 text-white rounded-full">{newAppts}</span>}
        </button>
        <button onClick={() => setTab("messages")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${tab === "messages" ? "bg-[#1e3a5f] text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
          <MessageSquare className="w-4 h-4" />
          Messages
          {unreadMsgs > 0 && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">{unreadMsgs}</span>}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : tab === "appointments" ? (
        <>
          {/* Appointment filter */}
          <div className="flex gap-1 flex-wrap">
            {[
              { key: "pending", label: `New (${appointments.filter(e => e.status === "pending").length})` },
              { key: "confirmed", label: "Confirmed" },
              { key: "all", label: "All" },
              { key: "completed", label: "Done" },
              { key: "cancelled", label: "Cancelled" },
            ].map((f) => (
              <button key={f.key} onClick={() => setApptFilter(f.key as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg ${apptFilter === f.key ? "bg-[#1e3a5f] text-white" : "bg-white text-slate-600 border border-slate-200"}`}>
                {f.label}
              </button>
            ))}
          </div>

          {filteredAppts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              {apptFilter === "pending" ? "No new enquiries 🎉" : "None found."}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppts.map((enq) => {
                const config = STATUS_CONFIG[enq.status || "pending"];
                return (
                  <div key={enq.id} className={`bg-white rounded-xl border p-4 ${enq.status === "pending" ? "border-l-4 border-l-blue-500 border-blue-100" : "border-slate-100"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" /> {enq.patientName}
                          </span>
                          {enq.isNewPatient && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 rounded-full">New Patient</span>}
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.color}`}>{config.label}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                          {enq.patientPhone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {enq.patientPhone}</span>}
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {enq.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {enq.time}</span>
                          {enq.departmentSlug && <span className="capitalize">{enq.departmentSlug.replace(/-/g, " ")}</span>}
                        </div>
                        {enq.notes && <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 rounded p-2">{enq.notes}</p>}
                        <p className="text-[10px] text-slate-400 mt-1.5">
                          {enq.createdAt?.toDate?.()?.toLocaleString("en-IN") || "—"}{enq.patientEmail && ` · ${enq.patientEmail}`}
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
        </>
      ) : (
        /* Contact Messages */
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No contact messages yet.</div>
          ) : messages.map((msg) => (
            <div key={msg.id}
              onClick={() => !msg.isRead && markRead(msg.id)}
              className={`bg-white rounded-xl border p-4 cursor-pointer hover:bg-slate-50 ${!msg.isRead ? "border-l-4 border-l-red-400 border-red-100" : "border-slate-100 opacity-80"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800">{msg.name}</span>
                    {!msg.isRead && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full">Unread</span>}
                  </div>
                  {msg.subject && <p className="text-sm font-medium text-slate-700 mb-1">{msg.subject}</p>}
                  <p className="text-sm text-slate-600">{msg.message}</p>
                  <div className="flex gap-4 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {msg.email}</span>
                    {msg.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {msg.phone}</span>}
                    <span>{msg.createdAt?.toDate?.()?.toLocaleString("en-IN") || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

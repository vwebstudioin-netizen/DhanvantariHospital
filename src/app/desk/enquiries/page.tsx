"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Inbox, Phone, Calendar, Clock, RefreshCw, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  messageType?: "appointment" | "contact"; // appointment or contact form
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  // Appointment-specific fields
  date?: string;
  time?: string;
  departmentSlug?: string;
  serviceSlug?: string;
  isNewPatient?: boolean;
  // Status
  isRead?: boolean;
  status?: string;
  createdAt: any;
}

const STATUS_CONFIG = {
  pending:   { label: "New",       color: "bg-blue-100 text-blue-700" },
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700" },
  completed: { label: "Done",      color: "bg-gray-100 text-gray-600" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
};

export default function EnquiriesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "appointment" | "contact">("all");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Message[]);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }

  const markRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "contactMessages", id), { isRead: true });
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, isRead: true } : m));
    } catch { /* ignore */ }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "contactMessages", id), { status, isRead: true });
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status, isRead: true } : m));
      toast.success("Status updated");
    } catch { toast.error("Failed"); }
  };

  const filtered = filter === "all"
    ? messages
    : filter === "appointment"
    ? messages.filter((m) => m.messageType === "appointment")
    : messages.filter((m) => !m.messageType || m.messageType === "contact");

  const unread = messages.filter((m) => !m.isRead).length;
  const newAppts = messages.filter((m) => m.messageType === "appointment" && !m.isRead).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Inbox className="w-5 h-5" />
            Messages & Enquiries
            {unread > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">{unread} new</span>
            )}
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">Appointment requests + contact form messages from the website</p>
        </div>
        <button onClick={load} className="p-2 text-slate-400 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1">
        <button onClick={() => setFilter("all")}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg ${filter === "all" ? "bg-[#1e3a5f] text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
          All ({messages.length})
        </button>
        <button onClick={() => setFilter("appointment")}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg ${filter === "appointment" ? "bg-[#1e3a5f] text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
          <Calendar className="w-4 h-4" />
          Appointments
          {newAppts > 0 && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-500 text-white rounded-full">{newAppts}</span>}
        </button>
        <button onClick={() => setFilter("contact")}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg ${filter === "contact" ? "bg-[#1e3a5f] text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
          <Mail className="w-4 h-4" />
          Contact
        </button>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">No messages yet.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => {
            const isAppt = msg.messageType === "appointment";
            const statusConfig = STATUS_CONFIG[msg.status as keyof typeof STATUS_CONFIG];
            return (
              <div key={msg.id}
                onClick={() => !msg.isRead && markRead(msg.id)}
                className={`bg-white rounded-xl border p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                  !msg.isRead
                    ? isAppt
                      ? "border-l-4 border-l-blue-500 border-blue-100"
                      : "border-l-4 border-l-slate-400 border-slate-100"
                    : "border-slate-100 opacity-90"
                }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${isAppt ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                        {isAppt ? "📅 Appointment" : "💬 Contact"}
                      </span>
                      {!msg.isRead && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full">Unread</span>}
                      {isAppt && statusConfig && (
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      )}
                      {isAppt && msg.isNewPatient && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 rounded-full">New Patient</span>
                      )}
                    </div>

                    {/* Name & contact */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {msg.name}
                      </span>
                      {msg.phone && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {msg.phone}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {msg.email}
                      </span>
                    </div>

                    {/* Appointment details */}
                    {isAppt && msg.date && (
                      <div className="flex gap-3 mt-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {msg.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {msg.time}</span>
                        {msg.departmentSlug && <span className="capitalize">{msg.departmentSlug.replace(/-/g, " ")}</span>}
                      </div>
                    )}

                    {/* Subject / message */}
                    {msg.subject && !isAppt && (
                      <p className="text-sm font-medium text-slate-700 mt-1">{msg.subject}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 whitespace-pre-line">
                      {isAppt ? msg.message.split("\n").slice(0, 2).join(" · ") : msg.message}
                    </p>

                    <p className="text-[10px] text-slate-400 mt-1.5">
                      {msg.createdAt?.toDate?.()?.toLocaleString("en-IN") || "—"}
                    </p>
                  </div>

                  {/* Actions (appointment only) */}
                  {isAppt && (
                    <div className="flex flex-col gap-1.5 shrink-0">
                      {(!msg.status || msg.status === "pending") && (
                        <button onClick={(e) => { e.stopPropagation(); updateStatus(msg.id, "confirmed"); }}
                          className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100">
                          Confirm
                        </button>
                      )}
                      {msg.status === "confirmed" && (
                        <button onClick={(e) => { e.stopPropagation(); updateStatus(msg.id, "completed"); }}
                          className="px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                          Done
                        </button>
                      )}
                      {msg.status !== "cancelled" && msg.status !== "completed" && (
                        <button onClick={(e) => { e.stopPropagation(); updateStatus(msg.id, "cancelled"); }}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

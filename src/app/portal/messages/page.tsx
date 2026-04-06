"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthContext } from "@/providers/AuthProvider";
import { getPatient } from "@/lib/patients";
import { MessageSquare, Plus, Mail } from "lucide-react";

export default function PortalMessages() {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const pat = await getPatient(user!.uid);
        const email = user!.email?.trim();
        const phone = pat?.phone?.trim();

        const snap = await getDocs(collection(db, "contactMessages"));
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
        const mine = all.filter(m =>
          (email && m.email === email) ||
          (phone && m.phone === phone)
        ).sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
        setMessages(mine);
      } catch { /* silent */ }
      finally { setLoading(false); }
    }
    load();
  }, [user]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <Link href="/portal/messages/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] transition-colors">
          <Plus className="h-4 w-4" /> New Message
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse h-16" />)}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No messages yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Messages you send to the hospital will appear here.</p>
          <Link href="/portal/messages/new" className="text-sm text-primary hover:underline">Send a message →</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map(msg => (
            <div key={msg.id} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {msg.subject || msg.messageType === "appointment" ? "Appointment Request" : "Message"}
                  </p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    msg.status === "resolved" ? "bg-green-100 text-green-700" :
                    msg.status === "read" ? "bg-gray-100 text-gray-600" :
                    "bg-blue-100 text-blue-700"
                  }`}>{msg.status ?? "sent"}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {msg.createdAt?.toDate?.()?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) ?? "—"}
                </p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

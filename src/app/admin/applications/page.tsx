"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Briefcase, Phone, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Application {
  id: string;
  position: string;
  department?: string;
  applicantName: string;
  applicantPhone: string;
  coverNote?: string;
  status: "new" | "reviewed" | "shortlisted" | "rejected";
  createdAt?: any;
}

const STATUS: Record<string, { label: string; color: string }> = {
  new:         { label: "New",        color: "bg-blue-100 text-blue-700" },
  reviewed:    { label: "Reviewed",   color: "bg-amber-100 text-amber-700" },
  shortlisted: { label: "Shortlisted",color: "bg-green-100 text-green-700" },
  rejected:    { label: "Rejected",   color: "bg-red-100 text-red-700" },
};

export default function AdminApplications() {
  const [apps, setApps]       = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<"all" | Application["status"]>("all");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "jobApplications"), orderBy("createdAt", "desc")));
      setApps(snap.docs.map(d => ({ id: d.id, ...d.data() } as Application)));
    } catch { toast.error("Failed to load applications"); }
    finally { setLoading(false); }
  }

  async function setStatus(id: string, status: Application["status"]) {
    try {
      await updateDoc(doc(db, "jobApplications", id), { status });
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast.success(`Marked as ${STATUS[status].label}`);
    } catch { toast.error("Update failed"); }
  }

  const filtered = filter === "all" ? apps : apps.filter(a => a.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Applications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{apps.length} total · {apps.filter(a => a.status === "new").length} new</p>
        </div>
        <button onClick={load} className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[["all", "All"], ["new", "New"], ["shortlisted", "Shortlisted"], ["reviewed", "Reviewed"], ["rejected", "Rejected"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val as any)}
            className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              filter === val ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl text-muted-foreground">
          <Briefcase className="w-10 h-10 opacity-30 mx-auto mb-3" />
          <p>No applications {filter !== "all" ? `with status "${filter}"` : "yet"}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => (
            <div key={app.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground">{app.applicantName}</p>
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", STATUS[app.status]?.color ?? "bg-gray-100 text-gray-600")}>
                      {STATUS[app.status]?.label ?? app.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {app.position}
                      {app.department && ` · ${app.department}`}
                    </span>
                    <a href={`tel:${app.applicantPhone}`} className="flex items-center gap-1 text-primary hover:underline">
                      <Phone className="w-3 h-3" /> {app.applicantPhone}
                    </a>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {app.createdAt?.toDate?.()?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) ?? "—"}
                    </span>
                  </div>
                  {app.coverNote && (
                    <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 line-clamp-3">{app.coverNote}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setStatus(app.id, "shortlisted")}
                    className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Shortlist">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => setStatus(app.id, "reviewed")}
                    className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors" title="Mark Reviewed">
                    <Clock className="w-4 h-4" />
                  </button>
                  <button onClick={() => setStatus(app.id, "rejected")}
                    className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Reject">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

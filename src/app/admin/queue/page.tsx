"use client";

import { useState, useRef } from "react";
import { useQueue } from "@/hooks/useQueue";
import TokenSlip from "@/components/shared/TokenSlip";
import {
  Ticket, Phone, User, Plus, ChevronRight,
  Check, SkipForward, UserX, Printer, Stethoscope, Play,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

const PURPOSES = [
  "General Consultation", "Emergency / Accident", "Surgery Review",
  "Gynecology", "Pediatrics / Child", "Orthopedics",
  "Neurology", "Cardiology", "Critical Care", "Follow-up", "Lab / Tests", "Other",
];

export default function QueuePage() {
  const {
    tokens, waitingTokens, calledToken, servingToken, activeToken,
    completedTokens, config, loading,
    issueToken, callNext, startConsultation, complete, skip, noShow,
  } = useQueue();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [issuing, setIssuing] = useState(false);
  const [lastIssued, setLastIssued] = useState<{ displayNumber: string; patientName: string } | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // Doctor View link adapts: /admin/queue → /admin/queue/doctor | /desk/queue → /desk/queue/doctor
  const doctorViewHref = pathname.startsWith("/desk") ? "/desk/queue/doctor" : "/admin/queue/doctor";

  const handleIssue = async () => {
    if (!name.trim() || !phone.trim()) return;
    setIssuing(true);
    try {
      const token = await issueToken(name.trim(), phone.trim(), purpose);
      setLastIssued({ displayNumber: token.displayNumber, patientName: token.patientName });
      setName(""); setPhone(""); setPurpose(PURPOSES[0]);
    } catch (err) {
      console.error("Failed to issue token:", err);
    } finally {
      setIssuing(false);
    }
  };

  const handleCallNext = async () => {
    const served = await callNext();
    if (served?.patientPhone && served?.displayNumber) {
      try {
        await fetch("/api/whatsapp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: served.patientPhone,
            message: `Your token *#${served.displayNumber}* has been called at ${process.env.NEXT_PUBLIC_HOSPITAL_NAME || "the hospital"}. Please come to the consultation room. Thank you!`,
          }),
        });
      } catch { /* WhatsApp failure should not block queue */ }
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const w = window.open("", "_blank");
      if (w) {
        w.document.write(`<html><head><title>Token</title><style>body{font-family:Arial,sans-serif;margin:0;padding:20px}</style></head><body>${printRef.current.innerHTML}</body></html>`);
        w.document.close(); w.print(); w.close();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Status badge color
  const statusColor = (s: string) => ({
    waiting: "bg-blue-100 text-blue-700",
    called: "bg-amber-100 text-amber-700",
    serving: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-600",
    skipped: "bg-orange-100 text-orange-700",
    "no-show": "bg-red-100 text-red-700",
  }[s] || "bg-gray-100 text-gray-600");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Token Queue</h1>
          <p className="text-sm text-muted-foreground">
            Waiting: {waitingTokens.length} · Active: {activeToken ? 1 : 0} · Done: {completedTokens.length}
          </p>
        </div>
        <Link href={doctorViewHref}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#152d4a]">
          <Stethoscope className="h-4 w-4" /> Doctor View
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Issue Token */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Plus className="h-5 w-5 text-primary" /> Issue Token
          </h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Patient Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter patient name"
                  className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" type="tel"
                  className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Purpose</label>
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                {PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <button onClick={handleIssue} disabled={!name.trim() || !phone.trim() || issuing}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-[#152d4a] disabled:opacity-50">
              <Ticket className="h-4 w-4" />
              {issuing ? "Issuing..." : "Issue Token"}
            </button>
          </div>
          {lastIssued && (
            <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-3 text-center">
              <p className="text-2xl font-bold text-green-700">#{lastIssued.displayNumber}</p>
              <p className="text-xs text-green-600">{lastIssued.patientName}</p>
              <button onClick={handlePrint} className="mt-2 flex items-center gap-1 mx-auto text-xs text-primary hover:underline">
                <Printer className="h-3 w-3" /> Print Slip
              </button>
              <div className="hidden"><div ref={printRef}><TokenSlip tokenNumber={lastIssued.displayNumber} patientName={lastIssued.patientName} /></div></div>
            </div>
          )}
        </div>

        {/* Active Token + Controls */}
        <div className="space-y-3">

          {/* Status display */}
          <div className={`rounded-xl border-2 p-5 text-center transition-colors ${
            servingToken ? "border-green-500 bg-green-50" :
            calledToken ? "border-amber-400 bg-amber-50" :
            "border-border bg-muted/30"
          }`}>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              {servingToken ? "In Consultation" : calledToken ? "Called — Awaiting Patient" : "Queue Ready"}
            </p>
            <p className={`text-6xl font-black my-2 ${
              servingToken ? "text-green-600" : calledToken ? "text-amber-600" : "text-muted-foreground"
            }`}>
              {activeToken ? `#${activeToken.displayNumber}` : "---"}
            </p>
            {activeToken && (
              <>
                <p className="font-semibold text-foreground">{activeToken.patientName}</p>
                <p className="text-xs text-muted-foreground">{activeToken.purpose}</p>
                <p className="text-xs text-muted-foreground">{activeToken.patientPhone}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-bold rounded-full ${statusColor(activeToken.status)}`}>
                  {activeToken.status === "called" ? "Called — waiting for patient" : "Consultation in progress"}
                </span>
              </>
            )}
          </div>

          {/* ── Step 1: No active token — Call Next ── */}
          {!activeToken && (
            <button onClick={handleCallNext} disabled={waitingTokens.length === 0}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-bold text-white hover:bg-[#152d4a] disabled:opacity-40">
              <ChevronRight className="h-5 w-5" />
              Call Next Patient
            </button>
          )}

          {/* ── Step 2: Token called — Start or Skip/No Show ── */}
          {calledToken && !servingToken && (
            <div className="space-y-2">
              <button onClick={() => startConsultation(calledToken.id)}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 py-3.5 text-sm font-bold text-white hover:bg-green-700">
                <Play className="h-4 w-4" /> Start Consultation
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={async () => {
                    try { await skip(calledToken.id); await handleCallNext(); }
                    catch { toast.error("Skip failed — please try again"); }
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2.5 text-sm font-medium text-white hover:bg-amber-600">
                  <SkipForward className="h-4 w-4" /> Skip
                </button>
                <button onClick={() => noShow(calledToken.id)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 text-red-600 py-2.5 text-sm font-medium hover:bg-red-50">
                  <UserX className="h-4 w-4" /> No Show
                </button>
              </div>
              <p className="text-center text-xs text-muted-foreground">Skip auto-calls the next patient</p>
            </div>
          )}

          {/* ── Step 3: Consultation in progress — Done or No Show ── */}
          {servingToken && (
            <div className="space-y-2">
              <button onClick={async () => { await complete(servingToken.id); await handleCallNext(); }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 py-3.5 text-sm font-bold text-white hover:bg-green-700">
                <Check className="h-5 w-5" /> Done — Call Next
              </button>
              <button onClick={() => noShow(servingToken.id)}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-red-200 text-red-600 py-2.5 text-sm font-medium hover:bg-red-50">
                <UserX className="h-4 w-4" /> Mark No Show
              </button>
            </div>
          )}

          {/* Next in line */}
          {waitingTokens.length > 0 && (
            <div className="rounded-lg bg-muted/50 border border-border p-3 text-sm">
              <p className="text-xs text-muted-foreground font-medium mb-1">Next in queue:</p>
              <p className="font-semibold">#{waitingTokens[0].displayNumber} — {waitingTokens[0].patientName}</p>
              <p className="text-xs text-muted-foreground">{waitingTokens[0].purpose}</p>
              {waitingTokens.length > 1 && (
                <p className="text-xs text-muted-foreground mt-1">+{waitingTokens.length - 1} more waiting</p>
              )}
            </div>
          )}
        </div>

        {/* Waiting List */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Waiting ({waitingTokens.length})</h2>
          {waitingTokens.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No patients waiting</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {waitingTokens.map((token, i) => (
                <div key={token.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold shrink-0 ${
                    i === 0 ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  }`}>
                    {token.displayNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{token.patientName}</p>
                    <p className="text-xs text-muted-foreground truncate">{token.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Today's log */}
          {completedTokens.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Today's Log</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {[...tokens].reverse().filter(t => ["completed","skipped","no-show","called","serving"].includes(t.status)).map((t) => (
                  <div key={t.id} className="flex items-center justify-between text-xs">
                    <span className="font-medium">#{t.displayNumber} {t.patientName}</span>
                    <span className={`px-1.5 py-0.5 rounded-full font-medium ${statusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

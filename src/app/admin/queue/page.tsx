"use client";

import { useState, useRef, useEffect } from "react";
import { usePatientLookup } from "@/hooks/usePatientLookup";
import { useQueue } from "@/hooks/useQueue";
import TokenSlip from "@/components/shared/TokenSlip";
import {
  Ticket, Phone, User, Plus, ChevronRight,
  Check, SkipForward, UserX, Printer, Stethoscope, Play, FileText,
} from "lucide-react";
import { SITE_NAME, CONTACT_PHONE, HOSPITAL_ADDRESS } from "@/lib/constants";
import { buildTokenCalledLink } from "@/lib/whatsapp";
import { format } from "date-fns";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

const PURPOSES = [
  "General Consultation", "Emergency / Accident", "Surgery Review",
  "Gynecology", "Pulmonology", "Urology", "Nephrology", "Orthopedics",
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
  const [cardId, setCardId] = useState("");
  const { match: patientMatch, loading: lookingUp } = usePatientLookup(phone, cardId);
  useEffect(() => {
    if (!patientMatch) return;
    if (!name)  setName(patientMatch.name);
    if (!phone && patientMatch.phone) setPhone(patientMatch.phone);
  }, [patientMatch]);
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [issuing, setIssuing] = useState(false);
  const [lastIssued, setLastIssued] = useState<{ displayNumber: string; patientName: string } | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // Doctor View link adapts based on which layout the user is in
  const doctorViewHref = pathname.startsWith("/desk")
    ? "/desk/queue/doctor"
    : pathname.startsWith("/doctor")
    ? "/doctor/queue/doctor"
    : "/admin/queue/doctor";

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
      // Open WhatsApp in browser with pre-filled message — user just taps Send
      const link = buildTokenCalledLink(served.patientPhone, served.displayNumber);
      window.open(link, "_blank", "noopener,noreferrer");
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

  const handleExportPDF = () => {
    const today = format(new Date(), "dd MMM yyyy");
    const rows = [...tokens].sort((a, b) => a.tokenNumber - b.tokenNumber).map(t => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#1e3a5f;">${t.displayNumber}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${t.patientName}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${t.patientPhone || "—"}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${t.purpose || "—"}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${t.issuedAt?.toDate?.()?.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}) ?? "—"}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">
          <span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;background:${
            t.status==="completed"?"#dcfce7":t.status==="serving"?"#dbeafe":t.status==="skipped"?"#fff7ed":t.status==="no-show"?"#fee2e2":"#f1f5f9"
          };color:${
            t.status==="completed"?"#16a34a":t.status==="serving"?"#1d4ed8":t.status==="skipped"?"#c2410c":t.status==="no-show"?"#dc2626":"#64748b"
          };">${t.status}</span>
        </td>
      </tr>`).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Token Log — ${today}</title>
    <style>body{font-family:Arial,sans-serif;margin:0;padding:24px;color:#1e293b;}@media print{body{padding:0}}</style>
    </head><body>
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #1e3a5f;padding-bottom:12px;margin-bottom:20px;">
      <div>
        <div style="font-size:20px;font-weight:900;color:#1e3a5f;text-transform:uppercase;">${SITE_NAME}</div>
        ${HOSPITAL_ADDRESS ? `<div style="font-size:11px;color:#64748b;">${HOSPITAL_ADDRESS}</div>` : ""}
        ${CONTACT_PHONE ? `<div style="font-size:11px;color:#64748b;">Ph: ${CONTACT_PHONE}</div>` : ""}
      </div>
      <div style="text-align:right;">
        <div style="font-size:16px;font-weight:700;color:#1e3a5f;">DAILY TOKEN LOG</div>
        <div style="font-size:12px;color:#64748b;">Date: ${today}</div>
        <div style="font-size:11px;color:#64748b;">Total tokens: ${tokens.length} · Completed: ${tokens.filter(t=>t.status==="completed").length}</div>
      </div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead><tr style="background:#1e3a5f;color:#fff;">
        <th style="padding:10px 12px;text-align:left;">Token #</th>
        <th style="padding:10px 12px;text-align:left;">Patient Name</th>
        <th style="padding:10px 12px;text-align:left;">Phone</th>
        <th style="padding:10px 12px;text-align:left;">Purpose</th>
        <th style="padding:10px 12px;text-align:left;">Time</th>
        <th style="padding:10px 12px;text-align:left;">Status</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:24px;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px;">
      Generated on ${new Date().toLocaleString("en-IN")} · ${SITE_NAME}
    </div>
    <script>window.onload=()=>{window.print();}</script>
    </body></html>`;

    const w = window.open("", "_blank", "width=900,height=700");
    if (w) { w.document.write(html); w.document.close(); }
  };

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
        <div className="flex items-center gap-2">
          <button onClick={handleExportPDF} disabled={tokens.length === 0}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-40 transition-colors">
            <FileText className="h-4 w-4" /> PDF Log
          </button>
          <Link href={doctorViewHref}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#152d4a]">
            <Stethoscope className="h-4 w-4" /> Doctor View
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Issue Token */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Plus className="h-5 w-5 text-primary" /> Issue Token
          </h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Card ID <span className="font-normal text-muted-foreground/60">(PAT-XXXX · auto-fills)</span>
              </label>
              <div className="relative">
                <Ticket className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input value={cardId} onChange={(e) => setCardId(e.target.value.toUpperCase())}
                  placeholder="PAT-0001 (optional)"
                  className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              {lookingUp && /^PAT-\d+$/i.test(cardId) && (
                <p className="text-xs text-muted-foreground mt-1">Looking up card…</p>
              )}
              {patientMatch && cardId && (
                <p className="text-xs text-green-600 font-medium mt-1">✓ {patientMatch.name} · {patientMatch.phone}</p>
              )}
            </div>
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
              {lookingUp && phone.replace(/\D/g,"").length === 10 && (
                <p className="text-xs text-muted-foreground mt-1">Searching…</p>
              )}
              {patientMatch && (
                <p className="text-xs text-green-600 font-medium mt-1">✓ Found: {patientMatch.name}</p>
              )}
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

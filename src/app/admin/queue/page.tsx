"use client";

import { useState, useRef } from "react";
import { useQueue } from "@/hooks/useQueue";
import TokenSlip from "@/components/shared/TokenSlip";
import {
  Ticket,
  Phone,
  User,
  Plus,
  ChevronRight,
  Check,
  SkipForward,
  UserX,
  Printer,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

const PURPOSES = [
  "General Consultation",
  "Emergency / Accident",
  "Surgery Review",
  "Gynecology",
  "Pediatrics / Child",
  "Orthopedics",
  "Neurology",
  "Cardiology",
  "Critical Care",
  "Follow-up",
  "Lab / Tests",
  "Other",
];

export default function QueuePage() {
  const {
    tokens,
    waitingTokens,
    currentServing,
    completedTokens,
    config,
    loading,
    issueToken,
    callNext,
    complete,
    skip,
    noShow,
  } = useQueue();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [issuing, setIssuing] = useState(false);
  const [lastIssued, setLastIssued] = useState<{
    displayNumber: string;
    patientName: string;
  } | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handleIssue = async () => {
    if (!name.trim() || !phone.trim()) return;
    setIssuing(true);
    try {
      const token = await issueToken(name.trim(), phone.trim(), purpose);
      setLastIssued({
        displayNumber: token.displayNumber,
        patientName: token.patientName,
      });
      setName("");
      setPhone("");
      setPurpose(PURPOSES[0]);
    } catch (err) {
      console.error("Failed to issue token:", err);
    } finally {
      setIssuing(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(
          `<html><head><title>Token</title><style>body{font-family:Arial,sans-serif;margin:0;padding:20px}@media print{body{padding:0}}</style></head><body>${printRef.current.innerHTML}</body></html>`
        );
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const handleCallNext = async () => {
    const served = await callNext();
    // Send WhatsApp notification to patient when token is called
    if (served?.patientPhone && served?.displayNumber) {
      try {
        await fetch("/api/whatsapp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: served.patientPhone,
            message: `Your token *#${served.displayNumber}* is being called now at ${process.env.NEXT_PUBLIC_HOSPITAL_NAME || "the hospital"}. Please proceed to the reception counter. Thank you!`,
          }),
        });
      } catch {
        // WhatsApp notification failure should not block queue operation
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Token Queue</h1>
          <p className="text-sm text-muted-foreground">
            Issued today: {tokens.length} | Waiting: {waitingTokens.length} |
            Completed: {completedTokens.length}
          </p>
        </div>
        <Link
          href="/admin/queue/doctor"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#152d4a]"
        >
          <Stethoscope className="h-4 w-4" />
          Doctor View
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Issue Token Form */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Plus className="h-5 w-5 text-primary" />
            Issue New Token
          </h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Patient Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter patient name"
                  className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Purpose
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {PURPOSES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleIssue}
              disabled={!name.trim() || !phone.trim() || issuing}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-[#152d4a] disabled:opacity-50"
            >
              <Ticket className="h-4 w-4" />
              {issuing ? "Issuing..." : "Issue Token"}
            </button>
          </div>

          {/* Last Issued */}
          {lastIssued && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-center dark:border-green-900 dark:bg-green-950">
              <p className="text-xs text-green-600 dark:text-green-400">
                Token Issued
              </p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                #{lastIssued.displayNumber}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {lastIssued.patientName}
              </p>
              <button
                onClick={handlePrint}
                className="mt-2 flex items-center gap-1 mx-auto text-xs text-primary hover:underline"
              >
                <Printer className="h-3 w-3" /> Print Slip
              </button>
              <div className="hidden">
                <div ref={printRef}>
                  <TokenSlip
                    tokenNumber={lastIssued.displayNumber}
                    patientName={lastIssued.patientName}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Current Serving + Controls */}
        <div className="space-y-4">
          {/* Now Serving display */}
          <div className={`rounded-xl border-2 p-6 text-center transition-colors ${
            currentServing ? "border-primary bg-primary/5" : "border-border bg-muted/30"
          }`}>
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              {currentServing ? "Now Serving" : "Queue Ready"}
            </p>
            <p className="my-2 text-5xl font-bold text-primary">
              {currentServing ? `#${currentServing.displayNumber}` : "---"}
            </p>
            {currentServing ? (
              <>
                <p className="text-sm font-medium text-foreground">{currentServing.patientName}</p>
                <p className="text-xs text-muted-foreground">{currentServing.purpose}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{currentServing.patientPhone}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {waitingTokens.length > 0
                  ? `${waitingTokens.length} patient(s) waiting — press Call Next`
                  : "No patients waiting"}
              </p>
            )}
          </div>

          {/* Action buttons — flow: Call Next → Start → Done/Skip/No Show */}
          <div className="space-y-2">

            {/* Step 1: No one serving — Call Next */}
            {!currentServing && (
              <button
                onClick={handleCallNext}
                disabled={waitingTokens.length === 0}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] py-3 text-sm font-semibold text-white hover:bg-[#152d4a] disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
                Call Next Patient
              </button>
            )}

            {/* Step 2: Patient called — Start or Skip/No Show */}
            {currentServing && (
              <>
                {/* Start Consultation */}
                <button
                  onClick={() => complete(currentServing.id)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                  Done — Call Next
                </button>

                <div className="grid grid-cols-2 gap-2">
                  {/* Skip — patient not ready, move to end of queue */}
                  <button
                    onClick={async () => {
                      await skip(currentServing.id);
                      await handleCallNext();
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 py-2.5 text-sm font-medium text-white hover:bg-amber-600"
                  >
                    <SkipForward className="h-4 w-4" />
                    Skip Patient
                  </button>

                  {/* No Show — patient absent */}
                  <button
                    onClick={() => noShow(currentServing.id)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 text-red-600 py-2.5 text-sm font-medium hover:bg-red-50"
                  >
                    <UserX className="h-4 w-4" />
                    No Show
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Next in line preview */}
          {waitingTokens.length > 0 && (
            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <span className="font-medium">Next up:</span> #{waitingTokens[0].displayNumber} — {waitingTokens[0].patientName}
              {waitingTokens.length > 1 && ` (+${waitingTokens.length - 1} more)`}
            </div>
          )}
        </div>

        {/* Waiting List */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Waiting ({waitingTokens.length})
          </h2>
          {waitingTokens.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No patients waiting
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {waitingTokens.map((token) => (
                <div
                  key={token.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {token.displayNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {token.patientName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {token.purpose}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Today's Full Log */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Today&apos;s Log ({tokens.length} tokens)
        </h2>
        {tokens.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            No tokens issued today
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 pr-4">#</th>
                  <th className="pb-2 pr-4">Patient</th>
                  <th className="pb-2 pr-4">Phone</th>
                  <th className="pb-2 pr-4">Purpose</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token) => (
                  <tr key={token.id} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono font-bold">
                      {token.displayNumber}
                    </td>
                    <td className="py-2 pr-4">{token.patientName}</td>
                    <td className="py-2 pr-4">{token.patientPhone}</td>
                    <td className="py-2 pr-4">{token.purpose}</td>
                    <td className="py-2">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          token.status === "waiting"
                            ? "bg-yellow-100 text-yellow-800"
                            : token.status === "serving"
                              ? "bg-blue-100 text-blue-800"
                              : token.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : token.status === "skipped"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                        }`}
                      >
                        {token.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

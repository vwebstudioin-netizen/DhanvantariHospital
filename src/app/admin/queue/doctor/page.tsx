"use client";

import { useQueue } from "@/hooks/useQueue";
import { Check, ChevronRight, SkipForward, UserX, Play } from "lucide-react";
import Link from "next/link";

export default function DoctorQueuePage() {
  const {
    waitingTokens, calledToken, servingToken, activeToken,
    completedTokens, loading, callNext, startConsultation, complete, skip, noShow,
  } = useQueue();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Doctor View</h1>
        <Link href="/admin/queue" className="text-sm text-primary hover:underline">← Reception View</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Waiting", value: waitingTokens.length, color: "text-blue-600" },
          { label: "Active", value: activeToken ? 1 : 0, color: "text-amber-600" },
          { label: "Done", value: completedTokens.length, color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Current patient display */}
      <div className={`rounded-xl border-2 p-8 text-center ${
        servingToken ? "border-green-500 bg-green-50" :
        calledToken ? "border-amber-400 bg-amber-50" :
        "border-border bg-card"
      }`}>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
          {servingToken ? "In Consultation" : calledToken ? "Called — Awaiting Patient" : "No Active Patient"}
        </p>
        <p className={`text-7xl font-black my-3 ${
          servingToken ? "text-green-600" : calledToken ? "text-amber-500" : "text-muted-foreground/30"
        }`}>
          {activeToken ? `#${activeToken.displayNumber}` : "---"}
        </p>
        {activeToken && (
          <div>
            <p className="text-xl font-semibold text-foreground">{activeToken.patientName}</p>
            <p className="text-muted-foreground mt-1">{activeToken.purpose}</p>
            <p className="text-sm text-muted-foreground">{activeToken.patientPhone}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">

        {/* No active token — Call Next */}
        {!activeToken && (
          <button onClick={() => callNext()} disabled={waitingTokens.length === 0}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-primary py-4 text-base font-bold text-white hover:bg-[#152d4a] disabled:opacity-40">
            <ChevronRight className="h-6 w-6" /> Call Next Patient
          </button>
        )}

        {/* Token called — Start or Skip/No Show */}
        {calledToken && !servingToken && (
          <>
            <button onClick={() => startConsultation(calledToken.id)}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-green-600 py-4 text-base font-bold text-white hover:bg-green-700">
              <Play className="h-6 w-6" /> Start Consultation
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={async () => { await skip(calledToken.id); await callNext(); }}
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-white hover:bg-amber-600">
                <SkipForward className="h-5 w-5" /> Skip Patient
              </button>
              <button onClick={() => noShow(calledToken.id)}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 text-red-600 py-3 text-sm font-bold hover:bg-red-50">
                <UserX className="h-5 w-5" /> No Show
              </button>
            </div>
          </>
        )}

        {/* Consultation in progress — Done */}
        {servingToken && (
          <>
            <button onClick={async () => { await complete(servingToken.id); await callNext(); }}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-green-600 py-4 text-base font-bold text-white hover:bg-green-700">
              <Check className="h-6 w-6" /> Done — Call Next
            </button>
            <button onClick={() => noShow(servingToken.id)}
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 text-red-600 py-3 text-sm font-bold hover:bg-red-50">
              <UserX className="h-5 w-5" /> Mark No Show
            </button>
          </>
        )}
      </div>

      {/* Next 3 waiting */}
      {waitingTokens.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-3">Next in Queue</h3>
          <div className="space-y-2">
            {waitingTokens.slice(0, 3).map((t, i) => (
              <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
                <span className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full ${
                  i === 0 ? "bg-primary text-white" : "bg-primary/10 text-primary"
                }`}>#{t.displayNumber}</span>
                <div>
                  <p className="text-sm font-medium">{t.patientName}</p>
                  <p className="text-xs text-muted-foreground">{t.purpose}</p>
                </div>
              </div>
            ))}
            {waitingTokens.length > 3 && (
              <p className="text-xs text-center text-muted-foreground">+{waitingTokens.length - 3} more waiting</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

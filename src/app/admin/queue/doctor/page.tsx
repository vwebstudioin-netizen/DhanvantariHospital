"use client";

import { useQueue } from "@/hooks/useQueue";
import { Check, ChevronRight, SkipForward, UserX } from "lucide-react";
import Link from "next/link";

export default function DoctorQueuePage() {
  const { waitingTokens, currentServing, completedTokens, loading, callNext, complete, skip, noShow } =
    useQueue();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Doctor View</h1>
        <Link
          href="/admin/queue"
          className="text-sm text-primary hover:underline"
        >
          &larr; Reception View
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-yellow-50 p-4 text-center dark:bg-yellow-950">
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
            {waitingTokens.length}
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400">Waiting</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-950">
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {currentServing ? 1 : 0}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">Current</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-950">
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {completedTokens.length}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400">Done</p>
        </div>
      </div>

      {/* Current Patient */}
      <div className="rounded-2xl border-2 border-primary bg-primary/5 p-8 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          Now Serving
        </p>
        <p className="my-3 text-7xl font-bold text-primary">
          {currentServing ? `#${currentServing.displayNumber}` : "---"}
        </p>
        {currentServing ? (
          <>
            <p className="text-xl font-semibold text-foreground">
              {currentServing.patientName}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentServing.purpose} &bull; {currentServing.patientPhone}
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">No patient being served</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => callNext()}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 col-span-2"
        >
          <ChevronRight className="h-6 w-6" />
          Call Next Patient
        </button>
        {currentServing && (
          <>
            <button
              onClick={() => complete(currentServing.id)}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-medium text-white hover:bg-green-700"
            >
              <Check className="h-5 w-5" />
              Complete
            </button>
            <button
              onClick={() => skip(currentServing.id)}
              className="flex items-center justify-center gap-2 rounded-xl bg-yellow-600 py-3 text-sm font-medium text-white hover:bg-yellow-700"
            >
              <SkipForward className="h-5 w-5" />
              Skip
            </button>
          </>
        )}
        {currentServing && (
          <button
            onClick={() => noShow(currentServing.id)}
            className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-medium text-white hover:bg-red-700"
          >
            <UserX className="h-5 w-5" />
            No Show
          </button>
        )}
      </div>

      {/* Next Up */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Next Up
        </h2>
        {waitingTokens.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            Queue is empty
          </p>
        ) : (
          <div className="space-y-2">
            {waitingTokens.slice(0, 5).map((token, i) => (
              <div
                key={token.id}
                className={`flex items-center gap-4 rounded-lg p-3 ${i === 0 ? "bg-primary/5 border border-primary/20" : "border border-border"}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                  {token.displayNumber}
                </div>
                <div>
                  <p className="font-medium">{token.patientName}</p>
                  <p className="text-xs text-muted-foreground">{token.purpose}</p>
                </div>
              </div>
            ))}
            {waitingTokens.length > 5 && (
              <p className="text-center text-xs text-muted-foreground">
                +{waitingTokens.length - 5} more waiting
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

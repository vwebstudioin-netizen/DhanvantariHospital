"use client";

import { useState, useEffect, useRef } from "react";
import { useQueue } from "@/hooks/useQueue";
import { SITE_NAME } from "@/lib/constants";

export default function QueueDisplayPage() {
  const { waitingTokens, currentServing, config, loading } = useQueue();
  const prevServingRef = useRef<string | null>(null);

  // Audio chime when token changes
  useEffect(() => {
    if (!currentServing) return;
    const currentId = currentServing.displayNumber;
    if (prevServingRef.current && prevServingRef.current !== currentId) {
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = "sine";
        gain.gain.value = 0.3;
        osc.start();
        setTimeout(() => {
          osc.frequency.value = 1100;
        }, 200);
        setTimeout(() => {
          osc.stop();
          ctx.close();
        }, 500);
      } catch {
        // Audio not supported
      }
    }
    prevServingRef.current = currentId;
  }, [currentServing]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-900 to-cyan-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-cyan-900 via-cyan-950 to-slate-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-cyan-800 px-8 py-4">
        <div>
          <h1 className="text-2xl font-bold">{SITE_NAME}</h1>
          <p className="text-sm text-cyan-300">Advanced Skin Care & Dermatology</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-cyan-300">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-lg font-mono font-bold text-cyan-200">
            <LiveClock />
          </p>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 gap-6 p-8">
        {/* Now Serving - Large */}
        <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border-2 border-cyan-500/30 bg-cyan-500/10 p-12">
          <p className="text-lg font-medium uppercase tracking-[0.3em] text-cyan-300">
            Now Serving
          </p>
          <p className="my-6 text-[12rem] font-bold leading-none tracking-tight text-white drop-shadow-lg">
            {currentServing ? `#${currentServing.displayNumber}` : "---"}
          </p>
          {currentServing && (
            <>
              <p className="text-3xl font-semibold">{currentServing.patientName}</p>
              <p className="mt-2 text-lg text-cyan-300">{currentServing.purpose}</p>
            </>
          )}
          {!currentServing && (
            <p className="text-xl text-cyan-400">Please wait for your number</p>
          )}
        </div>

        {/* Waiting List */}
        <div className="w-80 shrink-0 rounded-3xl border border-cyan-800 bg-cyan-950/50 p-6">
          <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Waiting ({waitingTokens.length})
          </h2>
          {waitingTokens.length === 0 ? (
            <p className="py-12 text-center text-cyan-500">No patients waiting</p>
          ) : (
            <div className="space-y-2">
              {waitingTokens.slice(0, 12).map((token, i) => (
                <div
                  key={token.id}
                  className={`flex items-center gap-3 rounded-xl p-3 transition ${
                    i === 0
                      ? "bg-cyan-500/20 border border-cyan-500/40"
                      : "bg-cyan-900/30"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600/30 text-lg font-bold">
                    {token.displayNumber}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {token.patientName}
                    </p>
                    <p className="truncate text-xs text-cyan-400">
                      {token.purpose}
                    </p>
                  </div>
                </div>
              ))}
              {waitingTokens.length > 12 && (
                <p className="text-center text-xs text-cyan-500">
                  +{waitingTokens.length - 12} more
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-cyan-800 px-8 py-3 text-center text-sm text-cyan-400">
        Please wait for your token number to be called &bull; Thank you for your patience
      </footer>
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("en-IN", { hour12: true }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return <>{time}</>;
}

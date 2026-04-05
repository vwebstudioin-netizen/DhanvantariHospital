"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQueue } from "@/hooks/useQueue";
import { SITE_NAME } from "@/lib/constants";

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return <>{time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}</>;
}

export default function QueueDisplayPage() {
  const { waitingTokens, activeToken, loading } = useQueue();
  const prevServingRef = useRef<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Create AudioContext on user click (browser autoplay policy)
  const enableSound = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    setSoundEnabled(true);
    // Play a test chime so user knows it's working
    playChime();
  }, []);

  const playChime = useCallback(() => {
    try {
      const ctx = audioCtxRef.current || new AudioContext();
      if (!audioCtxRef.current) audioCtxRef.current = ctx;

      const notes = [880, 1100, 1320]; // ascending 3-note chime
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + i * 0.15 + 0.05);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.15 + 0.3);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.35);
      });
    } catch {
      // Audio not supported
    }
  }, []);

  // Chime when token number changes
  useEffect(() => {
    if (!activeToken) return;
    const currentId = activeToken.displayNumber;
    if (prevServingRef.current !== null && prevServingRef.current !== currentId) {
      if (soundEnabled) playChime();
    }
    prevServingRef.current = currentId;
  }, [activeToken, soundEnabled, playChime]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1729]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      </div>
    );
  }

  const nextToken = waitingTokens[0] || null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0f1729] via-[#1e3a5f] to-[#0f1729] text-white select-none">

      {/* Sound enable button — click anywhere or the button */}
      {!soundEnabled && (
        <div className="fixed top-4 right-4 z-50">
          <button onClick={enableSound}
            className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-400 shadow-lg animate-pulse">
            🔇 Tap to Enable Sound
          </button>
        </div>
      )}
      {soundEnabled && (
        <div className="fixed top-4 right-4 z-50">
          <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded">🔊 Sound ON</span>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 px-8 py-4">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">{SITE_NAME}</h1>
          <p className="text-sm text-white/50">Emergency Treatment for Accident Cases Available</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/50">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <p className="text-lg font-mono font-bold text-white/80">
            <LiveClock />
          </p>
        </div>
      </header>

      {/* Main: Now Serving + Next */}
      <div className="flex flex-1 gap-6 p-8">

        {/* Now Serving — large */}
        <div onClick={!soundEnabled ? enableSound : undefined}
          className={`flex flex-1 flex-col items-center justify-center rounded-3xl p-12 cursor-pointer transition-all ${
            activeToken
              ? "border-2 border-white/20 bg-white/5"
              : "border-2 border-dashed border-white/10"
          }`}>
          <p className="text-base font-bold uppercase tracking-[0.4em] text-white/50 mb-4">
            Now Serving
          </p>
          <p className={`font-black leading-none tracking-tight drop-shadow-2xl transition-all ${
            activeToken ? "text-[11rem] text-white" : "text-[8rem] text-white/20"
          }`}>
            {activeToken ? `#${activeToken.displayNumber}` : "---"}
          </p>
          {activeToken && (
            <div className="mt-6 text-center">
              <p className="text-3xl font-semibold text-white/90">{activeToken.patientName}</p>
              <p className="mt-2 text-lg text-white/50">{activeToken.purpose}</p>
            </div>
          )}
          {!activeToken && (
            <p className="text-xl text-white/30 mt-4">Waiting to call next patient</p>
          )}
        </div>

        {/* Right panel: Next + Waiting */}
        <div className="w-80 shrink-0 flex flex-col gap-4">

          {/* Next up — prominent */}
          <div className={`rounded-2xl border p-5 text-center ${
            nextToken
              ? "border-amber-500/40 bg-amber-500/10"
              : "border-white/10 bg-white/5"
          }`}>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Next</p>
            {nextToken ? (
              <>
                <p className="text-6xl font-black text-amber-400">#{nextToken.displayNumber}</p>
                <p className="text-base font-medium text-white/80 mt-2">{nextToken.patientName}</p>
                <p className="text-xs text-white/40 mt-1">{nextToken.purpose}</p>
                <p className="text-xs text-amber-400/70 mt-2 font-medium">Please be ready</p>
              </>
            ) : (
              <p className="text-white/30 text-sm py-4">No one waiting</p>
            )}
          </div>

          {/* Waiting list */}
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4 overflow-hidden">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 text-center">
              Waiting ({waitingTokens.length})
            </h2>
            <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-500px)]">
              {waitingTokens.slice(1, 10).map((token) => (
                <div key={token.id} className="flex items-center gap-3 rounded-xl px-3 py-2 bg-white/5">
                  <span className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-sm font-bold shrink-0">
                    {token.displayNumber}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{token.patientName}</p>
                    <p className="text-xs text-white/40 truncate">{token.purpose}</p>
                  </div>
                </div>
              ))}
              {waitingTokens.length === 0 && (
                <p className="text-center text-white/30 text-sm py-6">Queue is empty</p>
              )}
              {waitingTokens.length > 10 && (
                <p className="text-center text-xs text-white/30 pt-2">
                  +{waitingTokens.length - 10} more waiting
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-3 flex items-center justify-between">
        <p className="text-xs text-white/30">Please listen for your token number to be called</p>
        <p className="text-xs text-white/20">{SITE_NAME}</p>
      </footer>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQueue } from "@/hooks/useQueue";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

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
  const [soundEnabled, setSoundEnabled] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Load voices — browsers require voiceschanged event (getVoices() returns [] on first call)
  useEffect(() => {
    const loadVoices = () => { voicesRef.current = window.speechSynthesis?.getVoices() ?? []; };
    loadVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", loadVoices);
  }, []);

  // Speak the token announcement using Web Speech API
  const announce = useCallback((token: { displayNumber: string; patientName: string }) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // stop any ongoing speech

    // Announce in Telugu first, then English fallback
    const num = parseInt(token.displayNumber, 10); // "005" → 5 (TTS reads it naturally)
    const teluguText  = `టోకెన్ నంబర్ ${num}. ${token.patientName}, దయచేసి కౌంటర్‌కు రండి. టోకెన్ నంబర్ ${num}.`;
    const englishText = `Token number ${num}. ${token.patientName}, please come to the counter. Token number ${num}.`;

    const voices = voicesRef.current;

    // Try Telugu voice first
    const teluguVoice = voices.find(v => v.lang.startsWith("te") || v.lang.includes("tel"));

    if (teluguVoice) {
      const utterance = new SpeechSynthesisUtterance(teluguText);
      utterance.voice = teluguVoice;
      utterance.lang  = "te-IN";
      utterance.rate  = 0.85;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback: English with bilingual text (browser reads Telugu chars as English if no Telugu voice)
      const utterance = new SpeechSynthesisUtterance(englishText);
      utterance.lang  = "en-IN";
      utterance.rate  = 0.85;
      utterance.pitch = 1;
      utterance.volume = 1;
      const indianVoice = voices.find(v => v.lang.includes("en-IN") || v.name.toLowerCase().includes("india"));
      if (indianVoice) utterance.voice = indianVoice;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Enable speech on user click (browser autoplay policy)
  const enableSound = useCallback(() => {
    setSoundEnabled(true);
    // Test announcement in Telugu
    const voices = voicesRef.current;
    const teluguVoice = voices.find(v => v.lang.startsWith("te") || v.lang.includes("tel"));
    const test = new SpeechSynthesisUtterance(
      teluguVoice ? "శబ్దం ప్రారంభించబడింది. టోకెన్ ప్రకటనలకు సిద్ధంగా ఉంది." : "Sound enabled. Ready to announce tokens."
    );
    test.lang = teluguVoice ? "te-IN" : "en-IN";
    if (teluguVoice) test.voice = teluguVoice;
    test.rate = 0.9;
    window.speechSynthesis.speak(test);
  }, []);

  // Announce when active token changes
  useEffect(() => {
    if (!activeToken) return;
    const currentId = activeToken.displayNumber;
    if (prevServingRef.current !== null && prevServingRef.current !== currentId) {
      if (soundEnabled) announce(activeToken);
    }
    prevServingRef.current = currentId;
  }, [activeToken, soundEnabled, announce]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1729]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      </div>
    );
  }

  const nextToken = waitingTokens[0] || null;

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-[#0f1729] via-[#1e3a5f] to-[#0f1729] text-white select-none">

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
          <p className="text-sm text-white/50">{SITE_TAGLINE}</p>
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
      <div className="flex flex-1 gap-4 p-6">

        {/* Now Serving — maximum size */}
        <div onClick={!soundEnabled ? enableSound : undefined}
          className={`flex flex-1 flex-col items-center justify-center rounded-3xl p-8 cursor-pointer transition-all ${
            activeToken
              ? "border-2 border-white/20 bg-white/5"
              : "border-2 border-dashed border-white/10"
          }`}>
          <p className="text-xl font-bold uppercase tracking-[0.5em] text-white/50 mb-2">
            Now Serving
          </p>
          <p className={`font-black leading-none tracking-tight drop-shadow-2xl transition-all ${
            activeToken ? "text-[16rem] text-white" : "text-[10rem] text-white/20"
          }`}>
            {activeToken ? `#${activeToken.displayNumber}` : "---"}
          </p>
          {activeToken && (
            <div className="mt-4 text-center">
              <p className="text-4xl font-bold text-white/90">{activeToken.patientName}</p>
              <p className="mt-2 text-xl text-white/50">{activeToken.purpose}</p>
            </div>
          )}
          {!activeToken && (
            <p className="text-2xl text-white/30 mt-4">Waiting to call next patient</p>
          )}
        </div>

        {/* Right panel: Next + Waiting */}
        <div className="w-72 shrink-0 flex flex-col gap-4">

          {/* Next up — prominent */}
          <div className={`rounded-2xl border p-5 text-center ${
            nextToken
              ? "border-amber-500/40 bg-amber-500/10"
              : "border-white/10 bg-white/5"
          }`}>
            <p className="text-sm font-bold uppercase tracking-widest text-white/40 mb-2">Next Up</p>
            {nextToken ? (
              <>
                <p className="text-7xl font-black text-amber-400">#{nextToken.displayNumber}</p>
                <p className="text-lg font-semibold text-white/80 mt-2">{nextToken.patientName}</p>
                <p className="text-sm text-white/40 mt-1">{nextToken.purpose}</p>
                <p className="text-sm text-amber-400/70 mt-3 font-bold tracking-wide">⚡ PLEASE BE READY</p>
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

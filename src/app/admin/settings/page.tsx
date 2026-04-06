"use client";

import { useState } from "react";
import { Database, Trash2, RefreshCw, CheckCircle, AlertTriangle, Zap } from "lucide-react";
import { seedDemoData, resetDemoData } from "@/lib/seed";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const [seeding, setSeeding] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [freshDemo, setFreshDemo] = useState(false);
  const [seedResult, setSeedResult] = useState<string[] | null>(null);
  const [seedError, setSeedError] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleFreshDemo = async () => {
    if (!window.confirm("This will DELETE all existing data then load fresh demo data.\n\nContinue?")) return;
    setFreshDemo(true);
    setSeedResult(null);
    setSeedError(null);
    try {
      await resetDemoData();
      const result = await seedDemoData();
      setSeedResult(result.seeded);
      toast.success("Fresh demo loaded — 20 patients with fully linked records!");
    } catch (err: any) {
      setSeedError(err?.message || "Failed");
      toast.error(err?.message || "Failed");
    } finally {
      setFreshDemo(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult(null);
    setSeedError(null);
    try {
      const result = await seedDemoData();
      setSeedResult(result.seeded);
      toast.success(`Seeded ${result.seeded.length} collections!`);
    } catch (err: any) {
      const msg = err?.message || "Failed to seed data";
      setSeedError(msg);
      toast.error(msg);
      console.error("Seed error:", err);
    } finally {
      setSeeding(false);
    }
  };

  const handleReset = async () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    setResetting(true);
    setResetDone(false);
    try {
      await resetDemoData();
      setResetDone(true);
      setConfirmReset(false);
      toast.success("All demo data deleted. Admin accounts and catalog preserved.");
    } catch (err: any) {
      toast.error(err.message || "Failed to reset");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage demo data and system configuration</p>
      </div>

      {/* Demo Data */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-foreground">Demo Data Management</h2>
        </div>

        <div className="p-6 space-y-6">

          {/* Fresh Demo — one-click reset + seed */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">Fresh Demo (Reset + Seed)</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Clears all existing data and loads a full simulated day: <strong>20 patients</strong> each with linked IPD/OPD cards, hospital invoices, pharmacy bills, appointments, queue tokens, and reviews — all connected by phone number so patient detail pages show complete history.
              </p>
            </div>
            <button onClick={handleFreshDemo} disabled={freshDemo || seeding || resetting}
              className="shrink-0 flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#152d4a] disabled:opacity-50 transition-colors">
              {freshDemo ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {freshDemo ? "Loading…" : "Load Fresh Demo"}
            </button>
          </div>

          <div className="border-t border-border" />

          {/* Reset */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Delete All Data</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Wipes all transactional data — patients, appointments, invoices, queue tokens, in-patient cards, reviews, stock movements, contact messages.
              </p>
              <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700">
                  <strong>Preserved:</strong> Admin & staff accounts, medicine catalog, suppliers, departments, services, doctors.
                </p>
              </div>
              {resetDone && (
                <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">All transactional data deleted.</span>
                </div>
              )}
            </div>
            <div className="shrink-0 flex flex-col gap-2 items-center">
              {confirmReset ? (
                <>
                  <p className="text-xs text-red-600 font-medium">Are you sure?</p>
                  <button
                    onClick={handleReset}
                    disabled={resetting}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {resetting ? "Deleting..." : "Yes, Delete All"}
                  </button>
                  <button onClick={() => setConfirmReset(false)} className="text-xs text-muted-foreground hover:underline">
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete All Data
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Hospital Info */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground mb-2">Hospital Branding</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configured via environment variables — update <code className="bg-muted px-1 py-0.5 rounded text-xs">.env.local</code> and redeploy to change.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Hospital Name", key: "NEXT_PUBLIC_HOSPITAL_NAME" },
            { label: "Phone", key: "NEXT_PUBLIC_HOSPITAL_PHONE" },
            { label: "Address", key: "NEXT_PUBLIC_HOSPITAL_ADDRESS" },
            { label: "Email", key: "NEXT_PUBLIC_HOSPITAL_EMAIL" },
            { label: "WhatsApp", key: "NEXT_PUBLIC_HOSPITAL_WHATSAPP" },
          ].map((f) => (
            <div key={f.key} className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">{f.label}</p>
              <p className="font-mono text-xs text-foreground mt-0.5">{f.key}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

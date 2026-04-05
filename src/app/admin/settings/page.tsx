"use client";

import { useState } from "react";
import { Database, Trash2, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";
import { seedDemoData, resetDemoData } from "@/lib/seed";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const [seeding, setSeeding] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [seedResult, setSeedResult] = useState<string[] | null>(null);
  const [seedError, setSeedError] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

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

          {/* Seed */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Load Demo Data</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Seeds realistic data for presentations: 5 patients, 5 queue tokens, 2 in-patient cards, 3 invoices, 3 appointments, 3 reviews, 8 medicines (if empty).
              </p>
              {seedResult && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Seeded successfully:</span>
                  </div>
                  <ul className="text-xs text-green-600 space-y-0.5 ml-6">
                    {seedResult.map((s) => <li key={s}>• {s}</li>)}
                  </ul>
                </div>
              )}
              {seedError && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-700">Seed failed:</p>
                    <p className="text-xs text-red-600 mt-0.5">{seedError}</p>
                    <p className="text-xs text-red-500 mt-1">Make sure you are logged in as admin and Firebase is connected.</p>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="shrink-0 flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${seeding ? "animate-spin" : ""}`} />
              {seeding ? "Seeding..." : "Seed Demo Data"}
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

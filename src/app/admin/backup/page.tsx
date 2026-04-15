"use client";

import { useState, useEffect, useRef } from "react";
import {
  collection, getDocs, addDoc, setDoc, doc, writeBatch, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Download, Upload, Shield, AlertTriangle, CheckCircle,
  Clock, Database, RefreshCw, Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

// Collections included in backup
const BACKUP_COLLECTIONS = [
  // Patients & clinical
  "patients", "appointments", "inpatientCards",
  // Billing
  "invoices", "pharmacyBills", "billingServices", "counters",
  // Pharmacy
  "medicines", "stockMovements", "suppliers",
  // Doctors
  "doctors",
  // CRM / communications
  "reviews", "contactMessages", "wishCampaigns", "newsletters",
  // Content
  "blogPosts", "gallery",
  // HR
  "jobOpenings", "jobApplications",
];

const LAST_BACKUP_KEY = "dh_last_backup";
const OVERDUE_DAYS = 30;

function daysSince(isoString: string | null): number | null {
  if (!isoString) return null;
  const ms = Date.now() - new Date(isoString).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export default function BackupPage() {
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [backing, setBacking] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [statsLoading, setStatsLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLastBackup(localStorage.getItem(LAST_BACKUP_KEY));
    loadStats();
  }, []);

  async function loadStats() {
    setStatsLoading(true);
    const counts: Record<string, number> = {};
    await Promise.all(
      BACKUP_COLLECTIONS.map(async (col) => {
        try {
          const snap = await getDocs(collection(db, col));
          counts[col] = snap.size;
        } catch { counts[col] = 0; }
      })
    );
    setStats(counts);
    setStatsLoading(false);
  }

  // ── BACKUP ────────────────────────────────────────────────────────────────
  async function handleBackup() {
    setBacking(true);
    setProgress([]);
    const backup: Record<string, any[]> = {
      _meta: {
        exportedAt: new Date().toISOString(),
        version: "1.0",
        hospital: "Dhanvantari Hospital",
      } as any,
    };

    try {
      for (const col of BACKUP_COLLECTIONS) {
        setProgress(p => [...p, `Exporting ${col}…`]);
        const snap = await getDocs(collection(db, col));
        backup[col] = snap.docs.map(d => ({
          _id: d.id,
          ...d.data(),
          // Convert Timestamps to ISO strings for JSON serialisation
          ...Object.fromEntries(
            Object.entries(d.data()).map(([k, v]) =>
              v && typeof v === "object" && "toDate" in v
                ? [k, (v as any).toDate().toISOString()]
                : [k, v]
            )
          ),
        }));
        setProgress(p => [...p, `✓ ${col} (${snap.size} records)`]);
      }

      const json = JSON.stringify(backup, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      a.href     = url;
      a.download = `dhanvantari-backup-${date}.json`;
      a.click();
      URL.revokeObjectURL(url);

      const now = new Date().toISOString();
      localStorage.setItem(LAST_BACKUP_KEY, now);
      setLastBackup(now);
      setProgress(p => [...p, "✅ Backup file downloaded successfully!"]);
      toast.success("Backup downloaded");
    } catch (e: any) {
      toast.error("Backup failed: " + e.message);
      setProgress(p => [...p, "❌ Backup failed — " + e.message]);
    } finally {
      setBacking(false);
    }
  }

  // ── RESTORE ───────────────────────────────────────────────────────────────
  async function handleRestore(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".json")) {
      toast.error("Please select a .json backup file");
      return;
    }

    const confirmed = window.confirm(
      "⚠️ Restore will ADD all records from the backup file into Firestore.\n\n" +
      "Existing records will NOT be deleted — duplicates may be created if you restore without clearing first.\n\n" +
      "Do you want to continue?"
    );
    if (!confirmed) { e.target.value = ""; return; }

    setRestoring(true);
    setProgress([]);

    try {
      const text    = await file.text();
      const backup  = JSON.parse(text);
      const version = backup._meta?.version ?? "unknown";
      const exportedAt = backup._meta?.exportedAt
        ? new Date(backup._meta.exportedAt).toLocaleDateString("en-IN")
        : "unknown";

      setProgress(p => [...p, `📦 Backup from ${exportedAt} (v${version})`]);

      for (const col of BACKUP_COLLECTIONS) {
        const records: any[] = backup[col] ?? [];
        if (!records.length) continue;

        setProgress(p => [...p, `Restoring ${col} (${records.length} records)…`]);

        // Write in batches of 400 (Firestore limit 500 per batch)
        for (let i = 0; i < records.length; i += 400) {
          const batch = writeBatch(db);
          records.slice(i, i + 400).forEach((rec) => {
            const { _id, ...data } = rec;
            // Convert ISO strings back to Timestamps for date fields
            const restored = Object.fromEntries(
              Object.entries(data).map(([k, v]) => {
                if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
                  return [k, Timestamp.fromDate(new Date(v))];
                }
                return [k, v];
              })
            );
            if (_id) {
              batch.set(doc(db, col, _id), restored, { merge: true });
            } else {
              batch.set(doc(collection(db, col)), restored);
            }
          });
          await batch.commit();
        }

        setProgress(p => [...p, `✓ ${col} restored (${records.length})`]);
      }

      setProgress(p => [...p, "✅ Restore complete!"]);
      toast.success("Data restored from backup");
      loadStats();
    } catch (e: any) {
      toast.error("Restore failed: " + e.message);
      setProgress(p => [...p, "❌ Restore failed — " + e.message]);
    } finally {
      setRestoring(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const days = daysSince(lastBackup);
  const isOverdue = days === null || days >= OVERDUE_DAYS;
  const totalRecords = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Data Backup & Restore</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Download a full JSON backup of all hospital data. Recommended monthly.
        </p>
      </div>

      {/* Overdue warning */}
      {isOverdue && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {lastBackup ? `Backup overdue — last backed up ${days} days ago` : "No backup has been taken yet"}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              We recommend taking a backup every 30 days. Click "Download Backup" below.
            </p>
          </div>
        </div>
      )}

      {lastBackup && !isOverdue && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-3">
          <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
          <p className="text-sm text-green-800">
            Last backup: <strong>{new Date(lastBackup).toLocaleString("en-IN")}</strong>
            {days !== null && <span className="text-green-600"> ({days} day{days !== 1 ? "s" : ""} ago)</span>}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Current Data Summary</h2>
          </div>
          <button onClick={loadStats} disabled={statsLoading}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted">
            <RefreshCw className={`w-3.5 h-3.5 ${statsLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
        {statsLoading ? (
          <p className="text-sm text-muted-foreground">Loading stats…</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {BACKUP_COLLECTIONS.map(col => (
                <div key={col} className="bg-muted/50 rounded-lg px-3 py-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground capitalize">{col.replace(/([A-Z])/g, " $1").trim()}</span>
                  <span className="text-xs font-bold text-foreground">{stats[col] ?? 0}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-right">
              {totalRecords.toLocaleString()} total records across {BACKUP_COLLECTIONS.length} collections
            </p>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Download Backup */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Download Backup</h3>
              <p className="text-xs text-muted-foreground">Export all data as JSON</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Downloads a <code className="bg-muted px-1 rounded">.json</code> file with all records from{" "}
            {BACKUP_COLLECTIONS.length} collections. Store it safely — this file can restore your data.
          </p>
          <button onClick={handleBackup} disabled={backing}
            className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-50 transition-colors">
            {backing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {backing ? "Downloading…" : "Download Backup"}
          </button>
        </div>

        {/* Restore */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Restore from Backup</h3>
              <p className="text-xs text-muted-foreground">Upload a .json backup file</p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Restore adds records from the backup. Clear existing data first to avoid duplicates.
            </p>
          </div>
          <button onClick={() => fileRef.current?.click()} disabled={restoring}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border text-foreground py-2.5 rounded-lg text-sm font-medium hover:border-primary hover:text-primary disabled:opacity-50 transition-colors">
            {restoring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {restoring ? "Restoring…" : "Choose Backup File"}
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleRestore} />
        </div>
      </div>

      {/* Progress Log */}
      {progress.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Operation Log
          </h3>
          <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
            {progress.map((line, i) => (
              <p key={i} className={
                line.startsWith("✅") ? "text-green-600 font-semibold" :
                line.startsWith("❌") ? "text-red-600 font-semibold" :
                line.startsWith("✓") ? "text-green-600" :
                "text-muted-foreground"
              }>{line}</p>
            ))}
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 flex items-start gap-3">
        <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-800 space-y-1">
          <p className="font-semibold">Backup recommendations</p>
          <ul className="list-disc list-inside space-y-0.5 text-blue-700">
            <li>Take a backup on the 1st of every month</li>
            <li>Store backup files in Google Drive or an external hard drive</li>
            <li>Keep at least 3 months of backup files</li>
            <li>Test restore periodically on a staging environment</li>
            <li>User accounts and roles are managed by Firebase — not included in this backup</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

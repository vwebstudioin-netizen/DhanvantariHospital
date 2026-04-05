"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Calendar, RefreshCw } from "lucide-react";
import { getMedicines } from "@/lib/medicines";
import { getMovements } from "@/lib/stock";
import type { Medicine } from "@/types/medicine";
import type { StockMovement } from "@/types/stock";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<"stock" | "expiry" | "dispensing">("stock");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(format(new Date(), "yyyy-MM-dd"));

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [meds, movs] = await Promise.all([getMedicines(false), getMovements(undefined, 200)]);
      setMedicines(meds);
      setMovements(movs);
    } catch { toast.error("Failed to load data"); }
    finally { setLoading(false); }
  }

  const activeMeds = medicines.filter((m) => m.isActive !== false);
  const lowStock = activeMeds.filter((m) => m.currentStock <= m.reorderLevel);
  const outOfStock = activeMeds.filter((m) => m.currentStock === 0);

  // Expiry buckets
  const today = new Date();
  const in30 = activeMeds.filter((m) => {
    if (!m.expiryDate) return false;
    const exp = new Date(m.expiryDate + "-01");
    const days = Math.floor((exp.getTime() - today.getTime()) / 86400000);
    return days >= 0 && days <= 30;
  });
  const in90 = activeMeds.filter((m) => {
    if (!m.expiryDate) return false;
    const exp = new Date(m.expiryDate + "-01");
    const days = Math.floor((exp.getTime() - today.getTime()) / 86400000);
    return days > 30 && days <= 90;
  });
  const expired = activeMeds.filter((m) => {
    if (!m.expiryDate) return false;
    const exp = new Date(m.expiryDate + "-01");
    return exp < today;
  });

  // Dispensing filtered by date
  const dispensing = movements
    .filter((m) => m.type === "out" && m.createdAt && m.createdAt.startsWith?.(dateFilter))
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground text-sm">Stock, dispensing, and expiry reports — live from Firestore</p>
        </div>
        <button onClick={load} className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Medicines", value: activeMeds.length, color: "text-foreground" },
          { label: "Low Stock", value: lowStock.length, color: "text-amber-600" },
          { label: "Out of Stock", value: outOfStock.length, color: "text-red-600" },
          { label: "Expiring ≤30d", value: in30.length, color: "text-orange-600" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{loading ? "—" : s.value}</p>
          </div>
        ))}
      </div>

      {/* Report tabs */}
      <div className="flex gap-1 flex-wrap">
        {[
          { key: "stock", label: "Stock Status" },
          { key: "expiry", label: "Expiry Tracking" },
          { key: "dispensing", label: "Dispensing Log" },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveReport(tab.key as any)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeReport === tab.key ? "bg-[#1e3a5f] text-white" : "bg-card border border-border text-muted-foreground hover:bg-muted"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : activeReport === "stock" ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Medicine</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Reorder</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {activeMeds.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No medicines in catalog. Add medicines first.</td></tr>
              ) : activeMeds.map((m) => {
                const isOut = m.currentStock === 0;
                const isLow = !isOut && m.currentStock <= m.reorderLevel;
                return (
                  <tr key={m.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="font-medium text-foreground">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.genericName} · {m.unit}</div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{m.category}</td>
                    <td className="px-5 py-3 text-right font-bold">
                      <span className={isOut ? "text-red-600" : isLow ? "text-amber-600" : "text-green-600"}>
                        {m.currentStock}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground hidden sm:table-cell">{m.reorderLevel}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        isOut ? "bg-red-100 text-red-700" : isLow ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                      }`}>
                        {isOut ? "Out" : isLow ? "Low" : "OK"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : activeReport === "expiry" ? (
        <div className="space-y-4">
          {expired.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3 bg-red-100 border-b border-red-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="font-semibold text-red-700">Expired ({expired.length})</span>
              </div>
              {expired.map((m) => <div key={m.id} className="px-5 py-3 border-b border-red-100 last:border-0 flex justify-between text-sm">
                <span className="font-medium text-red-800">{m.name}</span>
                <span className="text-red-600">{m.expiryDate}</span>
              </div>)}
            </div>
          )}
          {in30.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3 bg-orange-100 border-b border-orange-200 font-semibold text-orange-700">Expiring within 30 days ({in30.length})</div>
              {in30.map((m) => <div key={m.id} className="px-5 py-3 border-b border-orange-100 last:border-0 flex justify-between text-sm">
                <span>{m.name}</span><span className="text-orange-600">{m.expiryDate}</span>
              </div>)}
            </div>
          )}
          {in90.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3 bg-amber-100 border-b border-amber-200 font-semibold text-amber-700">Expiring within 90 days ({in90.length})</div>
              {in90.map((m) => <div key={m.id} className="px-5 py-3 border-b border-amber-100 last:border-0 flex justify-between text-sm">
                <span>{m.name}</span><span className="text-amber-600">{m.expiryDate}</span>
              </div>)}
            </div>
          )}
          {expired.length === 0 && in30.length === 0 && in90.length === 0 && (
            <div className="text-center py-10 text-muted-foreground bg-card border border-border rounded-xl">All medicines are within safe expiry dates. ✅</div>
          )}
        </div>
      ) : (
        /* Dispensing Log */
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <span className="text-sm text-muted-foreground">{dispensing.length} records</span>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Medicine</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Qty</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Patient</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Stock After</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Time</th>
                </tr>
              </thead>
              <tbody>
                {dispensing.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No dispensing records for {dateFilter}.</td></tr>
                ) : dispensing.map((m) => (
                  <tr key={m.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="px-5 py-3 font-medium text-foreground">{m.medicineName}</td>
                    <td className="px-5 py-3 text-center font-bold text-red-600">-{m.quantity}</td>
                    <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{m.patientName || "—"}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground hidden sm:table-cell">{m.newStock}</td>
                    <td className="px-5 py-3 text-muted-foreground text-xs hidden md:table-cell">{m.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

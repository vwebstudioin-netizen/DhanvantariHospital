"use client";

import { useState } from "react";
import { AlertTriangle, Calendar } from "lucide-react";

const STOCK_REPORT = [
  { name: "Paracetamol 500mg", category: "Analgesics", unit: "tablet", stock: 150, reorderLevel: 50, status: "ok" },
  { name: "Amoxicillin 500mg", category: "Antibiotics", unit: "capsule", stock: 8, reorderLevel: 30, status: "low" },
  { name: "Omeprazole 20mg", category: "Antacids", unit: "capsule", stock: 200, reorderLevel: 60, status: "ok" },
  { name: "Metformin 500mg", category: "Antidiabetics", unit: "tablet", stock: 0, reorderLevel: 40, status: "out" },
];

const EXPIRY_REPORT = [
  { name: "Amoxicillin 500mg", batch: "A2024-05", expiryDate: "2025-06", daysLeft: 30, status: "critical" },
  { name: "Cetirizine 10mg", batch: "C2024-08", expiryDate: "2025-09", daysLeft: 90, status: "warning" },
  { name: "Omeprazole 20mg", batch: "O2024-03", expiryDate: "2026-03", daysLeft: 365, status: "ok" },
];

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<"stock" | "expiry" | "dispensing">("stock");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        <p className="text-slate-500 text-sm">Stock, dispensing, and expiry reports</p>
      </div>

      <div className="flex gap-2">
        {[
          { key: "stock", label: "Stock Report" },
          { key: "expiry", label: "Expiry Tracking" },
          { key: "dispensing", label: "Today's Dispensing" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveReport(tab.key as any)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeReport === tab.key
                ? "bg-[#1e3a5f] text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeReport === "stock" && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Stock Status Report</h2>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">OK</span>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">LOW</span>
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">OUT</span>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Medicine</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Reorder At</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {STOCK_REPORT.map((item, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-medium text-slate-800">{item.name}</td>
                  <td className="px-5 py-3 text-slate-500 hidden sm:table-cell">{item.category}</td>
                  <td className="px-5 py-3 text-right font-bold text-slate-800">{item.stock}</td>
                  <td className="px-5 py-3 text-right text-slate-500 hidden sm:table-cell">{item.reorderLevel}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      item.status === "ok" ? "bg-green-100 text-green-700" :
                      item.status === "low" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {item.status === "ok" ? "OK" : item.status === "low" ? "LOW" : "OUT"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeReport === "expiry" && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <h2 className="font-semibold text-slate-800">Expiry Tracking</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Medicine</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Batch</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiry</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Days Left</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {EXPIRY_REPORT.map((item, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-medium text-slate-800">{item.name}</td>
                  <td className="px-5 py-3 text-slate-500 hidden sm:table-cell font-mono text-xs">{item.batch}</td>
                  <td className="px-5 py-3 text-slate-800">{item.expiryDate}</td>
                  <td className="px-5 py-3 text-center font-bold text-slate-800">{item.daysLeft}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                      item.status === "ok" ? "bg-green-100 text-green-700" :
                      item.status === "warning" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {item.status === "critical" && <AlertTriangle className="w-3 h-3" />}
                      {item.status === "critical" ? "Expiring Soon" : item.status === "warning" ? "Monitor" : "Safe"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeReport === "dispensing" && (
        <div className="bg-white rounded-xl border border-slate-100 p-8 text-center">
          <p className="text-slate-400">Today&apos;s dispensing log will appear here.</p>
          <p className="text-slate-400 text-sm mt-1">Connect to Firebase to view live data.</p>
        </div>
      )}
    </div>
  );
}

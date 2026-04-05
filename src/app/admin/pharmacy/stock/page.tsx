"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, SlidersHorizontal } from "lucide-react";

const MEDICINES = [
  { id: "1", name: "Paracetamol 500mg", unit: "tablet", currentStock: 150 },
  { id: "2", name: "Amoxicillin 500mg", unit: "capsule", currentStock: 8 },
  { id: "3", name: "Omeprazole 20mg", unit: "capsule", currentStock: 200 },
];

const MOVEMENTS = [
  { id: "1", medicineName: "Paracetamol 500mg", type: "in", quantity: 100, previousStock: 50, newStock: 150, reason: "Purchase", performedBy: "Staff", createdAt: "2026-03-26 09:00" },
  { id: "2", medicineName: "Amoxicillin 500mg", type: "out", quantity: 20, previousStock: 28, newStock: 8, reason: "Dispensed", patientName: "Ravi Kumar", performedBy: "Staff", createdAt: "2026-03-26 10:30" },
  { id: "3", medicineName: "Omeprazole 20mg", type: "in", quantity: 100, previousStock: 100, newStock: 200, reason: "Purchase", performedBy: "Staff", createdAt: "2026-03-25 14:00" },
];

export default function StockPage() {
  const [activeTab, setActiveTab] = useState<"add" | "dispense" | "log">("log");
  const [form, setForm] = useState({ medicineId: MEDICINES[0].id, quantity: 1, reason: "", patientName: "", patientPhone: "" });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Stock Management</h1>

      <div className="flex gap-1">
        {[
          { key: "log", label: "Movement Log", icon: SlidersHorizontal },
          { key: "add", label: "Add Stock", icon: ArrowUp },
          { key: "dispense", label: "Dispense", icon: ArrowDown },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.key
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {(activeTab === "add" || activeTab === "dispense") && (
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">
            {activeTab === "add" ? "Add Stock (Purchase)" : "Dispense Medicine"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Medicine *</label>
              <select
                value={form.medicineId}
                onChange={(e) => setForm({ ...form, medicineId: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              >
                {MEDICINES.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} (Stock: {m.currentStock})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Quantity *</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: +e.target.value })}
                min={1}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                {activeTab === "add" ? "Supplier / Invoice Ref" : "Reason"}
              </label>
              <input
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder={activeTab === "add" ? "Supplier name or invoice #" : "Dispensed for..."}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>
            {activeTab === "dispense" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Patient Name</label>
                  <input value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} placeholder="Patient name" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Patient Phone</label>
                  <input value={form.patientPhone} onChange={(e) => setForm({ ...form, patientPhone: e.target.value })} placeholder="9876543210" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
                </div>
              </>
            )}
          </div>
          <button className="mt-4 bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
            {activeTab === "add" ? "Add Stock" : "Dispense"}
          </button>
        </div>
      )}

      {/* Movement log */}
      {activeTab === "log" && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Stock Movement Log</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Medicine</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Reason</th>
              </tr>
            </thead>
            <tbody>
              {MOVEMENTS.map((m) => (
                <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-5 py-3 text-slate-500 text-xs">{m.createdAt}</td>
                  <td className="px-5 py-3 font-medium text-slate-800">{m.medicineName}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${m.type === "in" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {m.type === "in" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {m.type === "in" ? "Stock In" : "Dispensed"}
                    </span>
                  </td>
                  <td className={`px-5 py-3 text-right font-bold ${m.type === "in" ? "text-green-600" : "text-red-600"}`}>
                    {m.type === "in" ? "+" : "-"}{m.quantity}
                  </td>
                  <td className="px-5 py-3 text-right text-slate-600">{m.newStock}</td>
                  <td className="px-5 py-3 text-slate-500 hidden sm:table-cell">
                    {m.reason}
                    {m.patientName && <span className="text-xs text-slate-400"> · {m.patientName}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

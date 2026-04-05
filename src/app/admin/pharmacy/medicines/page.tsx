"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, AlertTriangle } from "lucide-react";
import { MEDICINE_CATEGORIES, type Medicine, type MedicineUnit } from "@/types/medicine";

const UNITS: MedicineUnit[] = ["tablet", "capsule", "ml", "mg", "vial", "strip", "sachet", "syrup", "cream", "drops"];

const SAMPLE: Medicine[] = [
  { id: "1", name: "Paracetamol 500mg", genericName: "Paracetamol", category: "Analgesics", manufacturer: "Sun Pharma", unit: "tablet", unitsPerPack: 10, costPrice: 8, sellingPrice: 12, currentStock: 150, reorderLevel: 50, batchNumber: "P2024-01", expiryDate: "2025-12", isActive: true, createdAt: "2024-01-01" },
  { id: "2", name: "Amoxicillin 500mg", genericName: "Amoxicillin", category: "Antibiotics", manufacturer: "Cipla", unit: "capsule", unitsPerPack: 10, costPrice: 45, sellingPrice: 60, currentStock: 8, reorderLevel: 30, batchNumber: "A2024-05", expiryDate: "2025-06", isActive: true, createdAt: "2024-01-01" },
  { id: "3", name: "Omeprazole 20mg", genericName: "Omeprazole", category: "Antacids", manufacturer: "Dr. Reddy's", unit: "capsule", unitsPerPack: 15, costPrice: 20, sellingPrice: 30, currentStock: 200, reorderLevel: 60, batchNumber: "O2024-03", expiryDate: "2026-03", isActive: true, createdAt: "2024-01-01" },
];

const EMPTY_FORM: Omit<Medicine, "id" | "createdAt"> = {
  name: "", genericName: "", category: MEDICINE_CATEGORIES[0] as string, manufacturer: "",
  unit: "tablet", unitsPerPack: 10, costPrice: 0, sellingPrice: 0,
  currentStock: 0, reorderLevel: 20, isActive: true,
};

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState(SAMPLE);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const filtered = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.name || !form.genericName) return;
    if (editId) {
      setMedicines(medicines.map((m) => (m.id === editId ? { ...m, ...form } : m)));
      setEditId(null);
    } else {
      setMedicines([...medicines, { id: `${Date.now()}`, ...form, createdAt: new Date().toISOString() }]);
    }
    setForm({ ...EMPTY_FORM });
    setShowForm(false);
  };

  const handleEdit = (m: Medicine) => {
    setForm({ name: m.name, genericName: m.genericName, category: m.category, manufacturer: m.manufacturer, unit: m.unit, unitsPerPack: m.unitsPerPack, costPrice: m.costPrice, sellingPrice: m.sellingPrice, currentStock: m.currentStock, reorderLevel: m.reorderLevel, isActive: m.isActive });
    setEditId(m.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  function f(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [key]: e.target.type === "number" ? +e.target.value : e.target.value });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medicines</h1>
          <p className="text-slate-500 text-sm">{medicines.length} items in catalog</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ ...EMPTY_FORM }); }} className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
          <Plus className="w-4 h-4" />
          Add Medicine
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">{editId ? "Edit Medicine" : "Add New Medicine"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Brand Name *", key: "name", placeholder: "Medicine brand name" },
              { label: "Generic Name *", key: "genericName", placeholder: "Generic/INN name" },
              { label: "Manufacturer", key: "manufacturer", placeholder: "Manufacturer" },
              { label: "Batch Number", key: "batchNumber", placeholder: "Batch No." },
              { label: "Expiry Date", key: "expiryDate", placeholder: "YYYY-MM" },
            ].map((f_) => (
              <div key={f_.key}>
                <label className="block text-xs font-medium text-slate-600 mb-1">{f_.label}</label>
                <input value={(form as any)[f_.key] || ""} onChange={f(f_.key)} placeholder={f_.placeholder}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
              <select value={form.category} onChange={f("category")} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]">
                {MEDICINE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Unit</label>
              <select value={form.unit} onChange={f("unit")} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]">
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            {[
              { label: "Units/Pack", key: "unitsPerPack" }, { label: "Cost Price (₹)", key: "costPrice" },
              { label: "Selling Price (₹)", key: "sellingPrice" }, { label: "Current Stock", key: "currentStock" },
              { label: "Reorder Level", key: "reorderLevel" },
            ].map((f_) => (
              <div key={f_.key}>
                <label className="block text-xs font-medium text-slate-600 mb-1">{f_.label}</label>
                <input type="number" value={(form as any)[f_.key]} onChange={f(f_.key)} min={0}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
              {editId ? "Update" : "Add Medicine"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medicines..."
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Medicine</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Category</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Price</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const isLow = m.currentStock <= m.reorderLevel;
              return (
                <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-800 flex items-center gap-2">
                      {m.name}
                      {isLow && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                    </div>
                    <div className="text-xs text-slate-400">{m.genericName} · {m.unit}</div>
                  </td>
                  <td className="px-5 py-3 text-slate-500 hidden md:table-cell">{m.category}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`font-bold ${isLow ? "text-red-600" : "text-green-600"}`}>{m.currentStock}</span>
                  </td>
                  <td className="px-5 py-3 text-right text-slate-600 hidden sm:table-cell">₹{m.sellingPrice}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => handleEdit(m)} className="p-1.5 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(m.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-10 text-slate-400">No medicines found.</div>}
      </div>
    </div>
  );
}

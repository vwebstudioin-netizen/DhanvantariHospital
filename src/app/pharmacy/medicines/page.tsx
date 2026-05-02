"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, AlertTriangle, RefreshCw, Upload, Pill } from "lucide-react";
import { MEDICINE_CATEGORIES, type Medicine, type MedicineUnit } from "@/types/medicine";
import { getMedicines, addMedicine, updateMedicine, deleteMedicine } from "@/lib/medicines";
import { getSuppliers } from "@/lib/stock";
import type { Supplier } from "@/types/stock";
import BulkImportMedicines from "@/components/admin/BulkImportMedicines";
import toast from "react-hot-toast";

const UNITS: MedicineUnit[] = ["tablet", "capsule", "ml", "mg", "vial", "strip", "sachet", "syrup", "cream", "drops"];

const EMPTY_FORM: Omit<Medicine, "id" | "createdAt"> = {
  name: "", genericName: "", category: MEDICINE_CATEGORIES[0] as string, manufacturer: "",
  unit: "tablet", unitsPerPack: 10, costPrice: 0, sellingPrice: 0,
  currentStock: 0, reorderLevel: 20, isActive: true,
};

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [activeTab, setActiveTab] = useState<"list" | "bulk">("list");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => { load(); loadSuppliers(); }, []);

  async function loadSuppliers() {
    try { setSuppliers(await getSuppliers()); } catch { /* ignore */ }
  }

  async function load() {
    setLoading(true);
    try {
      const data = await getMedicines(false);
      setMedicines(data);
    } catch (err: any) {
      toast.error("Failed to load medicines: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  }

  const filtered = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  );

  function f(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [key]: e.target.type === "number" ? +e.target.value : e.target.value });
  }

  const handleSave = async () => {
    if (!form.name || !form.genericName) { toast.error("Name and generic name are required"); return; }
    setSaving(true);
    try {
      if (editId) {
        await updateMedicine(editId, form);
        toast.success("Medicine updated");
      } else {
        await addMedicine(form);
        toast.success("Medicine added");
      }
      setShowForm(false);
      setEditId(null);
      setForm({ ...EMPTY_FORM });
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (m: Medicine) => {
    setForm({
      name: m.name, genericName: m.genericName, category: m.category,
      manufacturer: m.manufacturer, unit: m.unit, unitsPerPack: m.unitsPerPack,
      costPrice: m.costPrice, sellingPrice: m.sellingPrice,
      currentStock: m.currentStock, reorderLevel: m.reorderLevel,
      isActive: m.isActive,
      batchNumber: m.batchNumber,
      mfgDate: m.mfgDate,
      expiryDate: m.expiryDate,
    });
    setEditId(m.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this medicine?")) return;
    try {
      await deleteMedicine(id);
      toast.success("Deleted");
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medicines</h1>
          <p className="text-muted-foreground text-sm">{medicines.filter(m => m.isActive).length} active medicines</p>
        </div>
        <button onClick={load} className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-1 border-b border-border">
        {(["list", "bulk"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {tab === "list"
              ? <span className="flex items-center gap-1.5"><Pill className="w-4 h-4" /> Medicines List</span>
              : <span className="flex items-center gap-1.5"><Upload className="w-4 h-4" /> Bulk Import</span>}
          </button>
        ))}
      </div>
      {activeTab === "list" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medicines..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ ...EMPTY_FORM }); }}
              className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
              <Plus className="w-4 h-4" /> Add Medicine
            </button>
          </div>
          {showForm && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">{editId ? "Edit Medicine" : "Add New Medicine"}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Brand Name *", key: "name", placeholder: "e.g. Paracetamol 500mg" },
                  { label: "Generic Name *", key: "genericName", placeholder: "e.g. Paracetamol" },
                  { label: "Batch Number", key: "batchNumber", placeholder: "e.g. PCM-2026-01" },
                  { label: "Mfg. Date (YYYY-MM)", key: "mfgDate", placeholder: "e.g. 2025-10" },
                  { label: "Expiry Date (YYYY-MM)", key: "expiryDate", placeholder: "e.g. 2027-06" },
                ].map((f_) => (
                  <div key={f_.key}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">{f_.label}</label>
                    <input value={(form as any)[f_.key] || ""} onChange={f(f_.key)} placeholder={f_.placeholder}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Manufacturer / Supplier</label>
                  <select value={form.manufacturer} onChange={f("manufacturer")}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">— Select Supplier —</option>
                    {suppliers.filter((s) => s.isActive).map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
                  <select value={form.category} onChange={f("category")}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    {MEDICINE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Unit</label>
                  <select value={form.unit} onChange={f("unit")}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                {[
                  { label: "Units/Pack", key: "unitsPerPack" },
                  { label: "Cost Price (Rs.)", key: "costPrice" },
                  { label: "Selling Price (Rs.)", key: "sellingPrice" },
                  { label: "Current Stock", key: "currentStock" },
                  { label: "Reorder Level", key: "reorderLevel" },
                ].map((f_) => (
                  <div key={f_.key}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">{f_.label}</label>
                    <input type="number" value={(form as any)[f_.key]} onChange={f(f_.key)} min={0}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleSave} disabled={saving}
                  className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-50">
                  {saving ? "Saving..." : editId ? "Update" : "Add Medicine"}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-muted-foreground border border-border hover:bg-muted">
                  Cancel
                </button>
              </div>
            </div>
          )}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Medicine</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">Batch / Dates</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Stock</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground hidden sm:table-cell">Price</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      {search ? "No medicines match your search." : "No medicines added yet."}
                    </td></tr>
                  ) : filtered.map((m) => (
                    <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.genericName}</div>
                        <div className="text-xs text-muted-foreground">{m.manufacturer}</div>
                        {!m.isActive && <span className="text-xs text-red-500 font-medium">Inactive</span>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{m.category}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {m.batchNumber && <div className="text-xs font-mono text-foreground">#{m.batchNumber}</div>}
                        {m.mfgDate && <div className="text-xs text-muted-foreground">Mfg: {m.mfgDate}</div>}
                        {m.expiryDate && <div className="text-xs text-muted-foreground">Exp: {m.expiryDate}</div>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-semibold ${m.currentStock <= m.reorderLevel ? "text-red-500" : "text-foreground"}`}>{m.currentStock}</span>
                        <span className="text-xs text-muted-foreground ml-1">{m.unit}s</span>
                        {m.currentStock <= m.reorderLevel && <AlertTriangle className="w-3 h-3 text-amber-500 inline ml-1" />}
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <div className="text-foreground font-medium">Rs. {m.sellingPrice}</div>
                        <div className="text-xs text-muted-foreground">Cost: Rs. {m.costPrice}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(m)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(m.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {activeTab === "bulk" && (
        <BulkImportMedicines inline onComplete={() => { load(); setActiveTab("list"); }} />
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, AlertTriangle, RefreshCw } from "lucide-react";
import { MEDICINE_CATEGORIES, type Medicine, type MedicineUnit } from "@/types/medicine";
import { getMedicines, addMedicine, updateMedicine, deleteMedicine } from "@/lib/medicines";
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

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getMedicines(false); // get all including inactive
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
      setEditId(null);
      setForm({ ...EMPTY_FORM });
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
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
      ...(m.batchNumber !== undefined && { batchNumber: m.batchNumber }),
      ...(m.expiryDate !== undefined && { expiryDate: m.expiryDate }),
    });
    setEditId(m.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this medicine?")) return;
    try {
      await deleteMedicine(id);
      toast.success("Medicine deactivated");
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    }
  };

  function f(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [key]: e.target.type === "number" ? +e.target.value : e.target.value });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medicines</h1>
          <p className="text-muted-foreground text-sm">{medicines.filter(m => m.isActive).length} active medicines</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ ...EMPTY_FORM }); }}
            className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
            <Plus className="w-4 h-4" /> Add Medicine
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4">{editId ? "Edit Medicine" : "Add New Medicine"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Brand Name *", key: "name", placeholder: "e.g. Paracetamol 500mg" },
              { label: "Generic Name *", key: "genericName", placeholder: "e.g. Paracetamol" },
              { label: "Manufacturer", key: "manufacturer", placeholder: "e.g. Sun Pharma" },
              { label: "Batch Number", key: "batchNumber", placeholder: "e.g. P2024-01" },
              { label: "Expiry Date", key: "expiryDate", placeholder: "YYYY-MM" },
            ].map((f_) => (
              <div key={f_.key}>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{f_.label}</label>
                <input value={(form as any)[f_.key] || ""} onChange={f(f_.key)} placeholder={f_.placeholder}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            ))}
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
              { label: "Cost Price (₹)", key: "costPrice" },
              { label: "Selling Price (₹)", key: "sellingPrice" },
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

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medicines..."
          className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading medicines...</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Medicine</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Price</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const isLow = m.currentStock <= m.reorderLevel;
                return (
                  <tr key={m.id} className={`border-b border-border/50 hover:bg-muted/30 ${!m.isActive ? "opacity-50" : ""}`}>
                    <td className="px-5 py-3">
                      <div className="font-medium text-foreground flex items-center gap-2">
                        {m.name}
                        {isLow && m.isActive && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                        {!m.isActive && <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">Inactive</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">{m.genericName} · {m.unit}</div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{m.category}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`font-bold ${isLow ? "text-red-500" : "text-green-600"}`}>{m.currentStock}</span>
                      <div className="text-xs text-muted-foreground">min: {m.reorderLevel}</div>
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground hidden sm:table-cell">₹{m.sellingPrice}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => handleEdit(m)}
                          className="p-1.5 text-muted-foreground hover:text-[#1e3a5f] hover:bg-muted rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(m.id)}
                          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">
                  {search ? "No medicines match your search." : "No medicines added yet. Click 'Add Medicine' to start."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

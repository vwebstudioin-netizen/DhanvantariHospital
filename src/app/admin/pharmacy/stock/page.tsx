"use client";

import { useState, useEffect } from "react";
import { ArrowDown, ArrowUp, SlidersHorizontal, RefreshCw } from "lucide-react";
import { getMedicines } from "@/lib/medicines";
import { addStockIn, dispense, getMovements } from "@/lib/stock";
import type { Medicine } from "@/types/medicine";
import type { StockMovement } from "@/types/stock";
import toast from "react-hot-toast";

export default function StockPage() {
  const [activeTab, setActiveTab] = useState<"log" | "add" | "dispense">("log");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addForm, setAddForm] = useState({ medicineId: "", quantity: 1, reason: "", invoiceRef: "" });
  const [dispenseForm, setDispenseForm] = useState({ medicineId: "", quantity: 1, patientName: "", patientPhone: "" });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [meds, movs] = await Promise.all([getMedicines(true), getMovements(undefined, 50)]);
      setMedicines(meds);
      setMovements(movs);
      if (meds.length > 0) {
        if (!addForm.medicineId) setAddForm((f) => ({ ...f, medicineId: meds[0].id }));
        if (!dispenseForm.medicineId) setDispenseForm((f) => ({ ...f, medicineId: meds[0].id }));
      }
    } catch { toast.error("Failed to load data"); }
    finally { setLoading(false); }
  }

  const handleAddStock = async () => {
    if (!addForm.medicineId || addForm.quantity < 1) { toast.error("Select medicine and enter quantity"); return; }
    setSaving(true);
    try {
      await addStockIn(addForm.medicineId, addForm.quantity, addForm.reason || "Purchase", "Pharmacist", { invoiceRef: addForm.invoiceRef || undefined });
      toast.success("Stock added");
      setAddForm((f) => ({ ...f, quantity: 1, reason: "", invoiceRef: "" }));
      loadData(); setActiveTab("log");
    } catch (err: any) { toast.error(err.message || "Failed"); }
    finally { setSaving(false); }
  };

  const handleDispense = async () => {
    if (!dispenseForm.medicineId || dispenseForm.quantity < 1) { toast.error("Select medicine and quantity"); return; }
    const med = medicines.find((m) => m.id === dispenseForm.medicineId);
    if (med && med.currentStock < dispenseForm.quantity) { toast.error(`Only ${med.currentStock} ${med.unit}s in stock`); return; }
    setSaving(true);
    try {
      await dispense(dispenseForm.medicineId, dispenseForm.quantity, "Pharmacist",
        dispenseForm.patientName ? { name: dispenseForm.patientName, phone: dispenseForm.patientPhone } : undefined);
      toast.success("Dispensed successfully");
      setDispenseForm((f) => ({ ...f, quantity: 1, patientName: "", patientPhone: "" }));
      loadData(); setActiveTab("log");
    } catch (err: any) { toast.error(err.message || "Failed"); }
    finally { setSaving(false); }
  };

  const selAdd = medicines.find((m) => m.id === addForm.medicineId);
  const selDispense = medicines.find((m) => m.id === dispenseForm.medicineId);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Stock Management</h1>
        <button onClick={loadData} className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted"><RefreshCw className="w-4 h-4" /></button>
      </div>

      <div className="flex gap-1">
        {[{ key: "log", label: "Movement Log", icon: SlidersHorizontal }, { key: "add", label: "Add Stock", icon: ArrowUp }, { key: "dispense", label: "Dispense", icon: ArrowDown }].map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.key ? "bg-[#1e3a5f] text-white" : "bg-card text-muted-foreground border border-border hover:bg-muted"}`}>
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "add" && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Add Stock (Purchase)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Medicine *</label>
              <select value={addForm.medicineId} onChange={(e) => setAddForm({ ...addForm, medicineId: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {medicines.map((m) => <option key={m.id} value={m.id}>{m.name} (Stock: {m.currentStock})</option>)}
              </select>
              {selAdd && <p className="text-xs text-muted-foreground mt-1">Current: {selAdd.currentStock} {selAdd.unit}s</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Quantity *</label>
              <input type="number" min={1} value={addForm.quantity} onChange={(e) => setAddForm({ ...addForm, quantity: +e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Reason / Supplier</label>
              <input value={addForm.reason} onChange={(e) => setAddForm({ ...addForm, reason: e.target.value })} placeholder="e.g. Purchase from MedLine"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Invoice Reference</label>
              <input value={addForm.invoiceRef} onChange={(e) => setAddForm({ ...addForm, invoiceRef: e.target.value })} placeholder="Invoice number (optional)"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <button onClick={handleAddStock} disabled={saving || medicines.length === 0}
            className="mt-4 flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-50">
            <ArrowUp className="w-4 h-4" /> {saving ? "Adding..." : "Add Stock"}
          </button>
        </div>
      )}

      {activeTab === "dispense" && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Dispense Medicine</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Medicine *</label>
              <select value={dispenseForm.medicineId} onChange={(e) => setDispenseForm({ ...dispenseForm, medicineId: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {medicines.map((m) => <option key={m.id} value={m.id}>{m.name} (Stock: {m.currentStock})</option>)}
              </select>
              {selDispense && (
                <p className={`text-xs mt-1 ${selDispense.currentStock <= selDispense.reorderLevel ? "text-red-500" : "text-muted-foreground"}`}>
                  Available: {selDispense.currentStock} {selDispense.unit}s {selDispense.currentStock <= selDispense.reorderLevel && "⚠ Low"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Quantity *</label>
              <input type="number" min={1} value={dispenseForm.quantity} onChange={(e) => setDispenseForm({ ...dispenseForm, quantity: +e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Patient Name</label>
              <input value={dispenseForm.patientName} onChange={(e) => setDispenseForm({ ...dispenseForm, patientName: e.target.value })} placeholder="Optional"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Patient Phone</label>
              <input value={dispenseForm.patientPhone} onChange={(e) => setDispenseForm({ ...dispenseForm, patientPhone: e.target.value })} placeholder="Optional"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <button onClick={handleDispense} disabled={saving || medicines.length === 0}
            className="mt-4 flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">
            <ArrowDown className="w-4 h-4" /> {saving ? "Dispensing..." : "Dispense"}
          </button>
        </div>
      )}

      {activeTab === "log" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border"><h2 className="font-semibold text-foreground">Stock Movement Log</h2></div>
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">Loading...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Medicine</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Qty</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">After</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Details</th>
                </tr>
              </thead>
              <tbody>
                {movements.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No movements yet.</td></tr>
                ) : movements.map((m) => (
                  <tr key={m.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="px-5 py-3 text-xs text-muted-foreground">{m.createdAt ? new Date(m.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                    <td className="px-5 py-3 font-medium text-foreground">{m.medicineName}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${m.type === "in" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {m.type === "in" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {m.type === "in" ? "Stock In" : "Dispensed"}
                      </span>
                    </td>
                    <td className={`px-5 py-3 text-right font-bold ${m.type === "in" ? "text-green-600" : "text-red-600"}`}>{m.type === "in" ? "+" : "-"}{m.quantity}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground hidden sm:table-cell">{m.newStock}</td>
                    <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell text-xs">
                      {m.reason}{m.patientName && ` · ${m.patientName}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

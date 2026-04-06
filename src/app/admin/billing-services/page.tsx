"use client";

import { useState, useEffect } from "react";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Pencil, Trash2, Check, X, ToggleLeft, ToggleRight, Receipt } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

type ItemType = "consultation" | "procedure" | "medicine" | "room" | "lab" | "other";

interface BillingService {
  id: string;
  name: string;
  type: ItemType;
  price: number;
  isActive: boolean;
  createdAt?: any;
}

const TYPES: { value: ItemType; label: string; color: string }[] = [
  { value: "consultation", label: "Consultation", color: "bg-blue-100 text-blue-700" },
  { value: "procedure",    label: "Procedure",    color: "bg-purple-100 text-purple-700" },
  { value: "medicine",     label: "Medicine",     color: "bg-green-100 text-green-700" },
  { value: "room",         label: "Room/ICU",     color: "bg-amber-100 text-amber-700" },
  { value: "lab",          label: "Lab/Tests",    color: "bg-cyan-100 text-cyan-700" },
  { value: "other",        label: "Other",        color: "bg-gray-100 text-gray-700" },
];

const typeColor = (t: string) => TYPES.find(x => x.value === t)?.color ?? "bg-gray-100 text-gray-600";
const typeLabel = (t: string) => TYPES.find(x => x.value === t)?.label ?? t;

const EMPTY = { name: "", type: "consultation" as ItemType, price: 0 };

export default function BillingServicesPage() {
  const [services, setServices] = useState<BillingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(EMPTY);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "billingServices"), orderBy("createdAt", "asc")));
      setServices(snap.docs.map(d => ({ id: d.id, ...d.data() } as BillingService)));
    } catch { toast.error("Failed to load services"); }
    finally { setLoading(false); }
  }

  async function handleAdd() {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (form.price <= 0) { toast.error("Price must be greater than 0"); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, "billingServices"), {
        ...form, price: Number(form.price), isActive: true, createdAt: Timestamp.now(),
      });
      toast.success("Service added");
      setForm(EMPTY);
      setShowForm(false);
      load();
    } catch { toast.error("Failed to add service"); }
    finally { setSaving(false); }
  }

  async function handleSaveEdit(id: string) {
    if (!editForm.name.trim()) { toast.error("Name is required"); return; }
    if (editForm.price <= 0) { toast.error("Price must be > 0"); return; }
    setSaving(true);
    try {
      await updateDoc(doc(db, "billingServices", id), {
        name: editForm.name, type: editForm.type, price: Number(editForm.price),
      });
      toast.success("Updated");
      setEditId(null);
      load();
    } catch { toast.error("Failed to update"); }
    finally { setSaving(false); }
  }

  async function handleToggle(svc: BillingService) {
    try {
      await updateDoc(doc(db, "billingServices", svc.id), { isActive: !svc.isActive });
      setServices(prev => prev.map(s => s.id === svc.id ? { ...s, isActive: !s.isActive } : s));
    } catch { toast.error("Failed to update"); }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, "billingServices", id));
      toast.success("Deleted");
      setServices(prev => prev.filter(s => s.id !== id));
    } catch { toast.error("Failed to delete"); }
  }

  const active   = services.filter(s => s.isActive);
  const inactive = services.filter(s => !s.isActive);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing Services</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {active.length} active quick-add items shown in the billing form
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground">New Billing Service</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Service Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Consultation Fee"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as ItemType })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Price (₹) *</label>
              <input type="number" min="0" value={form.price || ""} onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                placeholder="500"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} disabled={saving}
              className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-50">
              <Check className="w-4 h-4" /> {saving ? "Saving…" : "Add Service"}
            </button>
            <button onClick={() => { setShowForm(false); setForm(EMPTY); }}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground border border-border hover:bg-muted">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading…</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Active */}
          <div className="px-5 py-3 bg-muted/40 border-b border-border flex items-center gap-2">
            <Receipt className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-foreground">Active — shown in billing form ({active.length})</span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/20 border-b border-border">
              <tr>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Service</th>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Type</th>
                <th className="text-right px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="text-right px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {active.length === 0 && (
                <tr><td colSpan={4} className="text-center py-8 text-muted-foreground text-sm">No active services. Add one above.</td></tr>
              )}
              {active.map(svc => (
                <ServiceRow key={svc.id} svc={svc} editId={editId} editForm={editForm}
                  setEditId={setEditId} setEditForm={setEditForm}
                  onSave={handleSaveEdit} onToggle={handleToggle} onDelete={handleDelete}
                  saving={saving} />
              ))}
            </tbody>
          </table>

          {/* Inactive */}
          {inactive.length > 0 && (
            <>
              <div className="px-5 py-3 bg-muted/40 border-t border-b border-border flex items-center gap-2">
                <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-muted-foreground">Inactive — hidden from billing ({inactive.length})</span>
              </div>
              <table className="w-full text-sm opacity-60">
                <tbody>
                  {inactive.map(svc => (
                    <ServiceRow key={svc.id} svc={svc} editId={editId} editForm={editForm}
                      setEditId={setEditId} setEditForm={setEditForm}
                      onSave={handleSaveEdit} onToggle={handleToggle} onDelete={handleDelete}
                      saving={saving} />
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 text-xs text-blue-700">
        Active services appear as quick-add buttons in the billing form for desk staff and reception. Toggle off to hide without deleting.
      </div>
    </div>
  );
}

function ServiceRow({ svc, editId, editForm, setEditId, setEditForm, onSave, onToggle, onDelete, saving }: {
  svc: BillingService; editId: string | null; editForm: typeof EMPTY;
  setEditId: (id: string | null) => void; setEditForm: (f: typeof EMPTY) => void;
  onSave: (id: string) => void; onToggle: (svc: BillingService) => void;
  onDelete: (id: string, name: string) => void; saving: boolean;
}) {
  const isEditing = editId === svc.id;

  if (isEditing) {
    return (
      <tr className="border-b border-border/50 bg-primary/5">
        <td className="px-5 py-2">
          <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
            className="w-full border border-border rounded-lg px-2 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
        </td>
        <td className="px-5 py-2 hidden sm:table-cell">
          <select value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value as ItemType })}
            className="border border-border rounded-lg px-2 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring">
            {[
              { value: "consultation", label: "Consultation" },
              { value: "procedure",    label: "Procedure" },
              { value: "medicine",     label: "Medicine" },
              { value: "room",         label: "Room/ICU" },
              { value: "lab",          label: "Lab/Tests" },
              { value: "other",        label: "Other" },
            ].map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </td>
        <td className="px-5 py-2 text-right">
          <input type="number" min="0" value={editForm.price || ""} onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })}
            className="w-24 border border-border rounded-lg px-2 py-1.5 text-sm bg-background text-right focus:outline-none focus:ring-1 focus:ring-ring" />
        </td>
        <td className="px-5 py-2 text-right">
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => onSave(svc.id)} disabled={saving}
              className="p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setEditId(null)}
              className="p-1.5 border border-border rounded-lg hover:bg-muted text-muted-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border/50 hover:bg-muted/20">
      <td className="px-5 py-3 font-medium text-foreground">{svc.name}</td>
      <td className="px-5 py-3 hidden sm:table-cell">
        <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full", typeColor(svc.type))}>
          {typeLabel(svc.type)}
        </span>
      </td>
      <td className="px-5 py-3 text-right font-semibold text-foreground">₹{svc.price.toLocaleString("en-IN")}</td>
      <td className="px-5 py-3 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button onClick={() => { setEditId(svc.id); setEditForm({ name: svc.name, type: svc.type, price: svc.price }); }}
            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onToggle(svc)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            title={svc.isActive ? "Deactivate" : "Activate"}>
            {svc.isActive ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4" />}
          </button>
          <button onClick={() => onDelete(svc.id, svc.name)}
            className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Edit, Trash2, Phone, Mail, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  gstin: string;
  createdAt: any;
}

const EMPTY = { name: "", contactPerson: "", phone: "", email: "", address: "", gstin: "" };

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "pharmacySuppliers"), orderBy("createdAt", "desc")));
      setSuppliers(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Supplier[]);
    } catch { toast.error("Failed to load suppliers"); }
    finally { setLoading(false); }
  }

  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value });

  const handleSave = async () => {
    if (!form.name || !form.phone) { toast.error("Name and phone are required"); return; }
    setSaving(true);
    try {
      if (editId) {
        await updateDoc(doc(db, "pharmacySuppliers", editId), { ...form });
        toast.success("Supplier updated");
      } else {
        await addDoc(collection(db, "pharmacySuppliers"), { ...form, createdAt: Timestamp.now() });
        toast.success("Supplier added");
      }
      setShowForm(false); setEditId(null); setForm({ ...EMPTY }); load();
    } catch { toast.error("Failed to save supplier"); }
    finally { setSaving(false); }
  };

  const handleEdit = (s: Supplier) => {
    setForm({ name: s.name, contactPerson: s.contactPerson, phone: s.phone, email: s.email, address: s.address, gstin: s.gstin });
    setEditId(s.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this supplier?")) return;
    await deleteDoc(doc(db, "pharmacySuppliers", id));
    toast.success("Deleted"); load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Suppliers</h1>
          <p className="text-slate-500 text-sm">{suppliers.length} suppliers</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ ...EMPTY }); }}
            className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
            <Plus className="w-4 h-4" /> Add Supplier
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
          <h3 className="font-semibold text-slate-800">{editId ? "Edit Supplier" : "New Supplier"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Company Name *", key: "name", placeholder: "Supplier company name" },
              { label: "Contact Person", key: "contactPerson", placeholder: "Contact person name" },
              { label: "Phone *", key: "phone", placeholder: "9876543210" },
              { label: "Email", key: "email", placeholder: "supplier@email.com" },
              { label: "GSTIN", key: "gstin", placeholder: "29ABCDE1234F1Z5" },
              { label: "Address", key: "address", placeholder: "City, State" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-slate-600 mb-1">{field.label}</label>
                <input value={(form as any)[field.key]} onChange={f(field.key)} placeholder={field.placeholder}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-50">
              {saving ? "Saving..." : editId ? "Update Supplier" : "Save Supplier"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); setForm({ ...EMPTY }); }}
              className="px-5 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {suppliers.length === 0 ? (
            <p className="col-span-2 text-center py-10 text-slate-400">No suppliers yet. Click "Add Supplier" to add one.</p>
          ) : suppliers.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-start justify-between">
                <div className="font-bold text-slate-800">{s.name}</div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(s)} className="p-1.5 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {s.contactPerson && <p className="text-sm text-slate-500 mt-1">{s.contactPerson}</p>}
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`tel:+91${s.phone}`} className="hover:text-[#1e3a5f]">{s.phone}</a>
                </div>
                {s.email && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${s.email}`} className="hover:text-[#1e3a5f]">{s.email}</a>
                  </div>
                )}
                {s.gstin && <p className="text-xs text-slate-400">GSTIN: {s.gstin}</p>}
                {s.address && <p className="text-xs text-slate-400">{s.address}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

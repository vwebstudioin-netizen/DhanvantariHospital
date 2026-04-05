"use client";

import { useState } from "react";
import { Plus, Edit, Phone, Mail } from "lucide-react";

const SAMPLE_SUPPLIERS = [
  { id: "1", name: "MedLine Pharmaceuticals", contactName: "Ramesh Kumar", phone: "9876543210", email: "ramesh@medline.com", gstNumber: "29ABCDE1234F1Z5", address: "Hyderabad, Telangana", isActive: true },
  { id: "2", name: "Apollo Pharma Distributors", contactName: "Sunita Sharma", phone: "9876543211", email: "sunita@apollopharma.com", gstNumber: "29FGHIJ5678K2A3", address: "Vijayawada, AP", isActive: true },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(SAMPLE_SUPPLIERS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", contactName: "", phone: "", email: "", gstNumber: "", address: "", isActive: true });

  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value });

  const handleSave = () => {
    if (!form.name || !form.phone) return;
    setSuppliers([...suppliers, { id: `${Date.now()}`, ...form }]);
    setForm({ name: "", contactName: "", phone: "", email: "", gstNumber: "", address: "", isActive: true });
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Suppliers</h1>
          <p className="text-slate-500 text-sm">{suppliers.length} suppliers</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
          <Plus className="w-4 h-4" />
          Add Supplier
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">New Supplier</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Company Name *", key: "name", placeholder: "Supplier company name" },
              { label: "Contact Person", key: "contactName", placeholder: "Contact person name" },
              { label: "Phone *", key: "phone", placeholder: "9876543210" },
              { label: "Email", key: "email", placeholder: "supplier@email.com" },
              { label: "GST Number", key: "gstNumber", placeholder: "29ABCDE1234F1Z5" },
              { label: "Address", key: "address", placeholder: "City, State" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-slate-600 mb-1">{field.label}</label>
                <input value={(form as any)[field.key]} onChange={f(field.key)} placeholder={field.placeholder}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">Save Supplier</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-start justify-between">
              <div className="font-bold text-slate-800">{s.name}</div>
              <button className="p-1.5 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 rounded-lg">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            {s.contactName && <p className="text-sm text-slate-500 mt-1">{s.contactName}</p>}
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
              {s.gstNumber && <p className="text-xs text-slate-400">GST: {s.gstNumber}</p>}
              {s.address && <p className="text-xs text-slate-400">{s.address}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

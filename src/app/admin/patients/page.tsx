"use client";

import { useState, useEffect } from "react";
import {
  collection, getDocs, addDoc, orderBy, query, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Search, RefreshCw, User, Phone, Mail, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
  emergencyContact?: string;
  source?: "portal" | "manual" | "seed";
  createdAt: any;
  lastLoginAt?: any;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function AdminPatients() {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/desk") ? "/desk/patients"
    : pathname.startsWith("/doctor") ? "/doctor/patients"
    : "/admin/patients";

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", dateOfBirth: "",
    bloodGroup: "", address: "", emergencyContact: "",
  });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const q = query(collection(db, "patients"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setPatients(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Patient[]);
    } catch { toast.error("Failed to load patients"); }
    finally { setLoading(false); }
  }

  const handleAdd = async () => {
    if (!form.name) { toast.error("Patient name is required"); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, "patients"), {
        ...form,
        source: "manual",
        uid: "",
        visitCount: 0,
        totalSpent: 0,
        createdAt: Timestamp.now(),
      });
      toast.success("Patient added!");
      setShowForm(false);
      setForm({ name: "", phone: "", email: "", dateOfBirth: "", bloodGroup: "", address: "", emergencyContact: "" });
      load();
    } catch { toast.error("Failed to add patient"); }
    finally { setSaving(false); }
  };

  const filtered = patients.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {patients.length} patients · Data from portal logins & manual entry
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
            <Plus className="w-4 h-4" /> Add Patient
          </button>
        </div>
      </div>

      {/* Add patient form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground">Add Patient Manually</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name *", key: "name", placeholder: "Patient full name" },
              { label: "Phone", key: "phone", placeholder: "9876543210" },
              { label: "Email", key: "email", placeholder: "patient@email.com" },
              { label: "Date of Birth", key: "dateOfBirth", placeholder: "YYYY-MM-DD", type: "date" },
              { label: "Address", key: "address", placeholder: "City, State" },
              { label: "Emergency Contact", key: "emergencyContact", placeholder: "Emergency phone" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                <input
                  type={f.type || "text"}
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Blood Group</label>
              <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select (optional)</option>
                {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} disabled={saving}
              className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-50">
              {saving ? "Adding..." : "Add Patient"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-5 py-2 rounded-lg text-sm font-medium text-muted-foreground border border-border hover:bg-muted">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone or email..."
          className="w-full pl-9 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      {/* Patient list */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading patients...</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patient</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Blood Group</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Source</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Registered</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">
                  {search ? "No patients found." : "No patients yet. Add manually or patients register via the portal."}
                </td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer group">
                  <td className="px-5 py-3">
                    <Link href={`${basePath}/${p.id}`} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">{p.name}</p>
                        {p.address && <p className="text-xs text-muted-foreground">{p.address}</p>}
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    {p.phone && (
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Phone className="w-3 h-3" /> {p.phone}
                      </div>
                    )}
                    {p.email && (
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
                        <Mail className="w-3 h-3" /> {p.email}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    {p.bloodGroup ? (
                      <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs font-bold rounded-full">{p.bloodGroup}</span>
                    ) : <span className="text-muted-foreground text-xs">—</span>}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      p.source === "portal" ? "bg-blue-100 text-blue-700" :
                      p.source === "manual" ? "bg-green-100 text-green-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {p.source === "portal" ? "Portal" : p.source === "manual" ? "Manual" : "Demo"}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell text-xs text-muted-foreground">
                    {p.createdAt?.toDate?.()?.toLocaleDateString("en-IN") || "—"}
                  </td>
                  <td className="px-3 py-3">
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
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

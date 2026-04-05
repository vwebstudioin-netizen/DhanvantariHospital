"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search, Building2, Users, Phone } from "lucide-react";

interface Department {
  id: string;
  name: string;
  head: string;
  phone: string;
  email: string;
  staffCount: number;
  description: string;
  isActive: boolean;
}

const initialDepartments: Department[] = [
  { id: "1", name: "Family Medicine", head: "Dr. Priya Sharma", phone: "(555) 123-4001", email: "familymedicine@clinicarepro.com", staffCount: 8, description: "Comprehensive primary care for patients of all ages.", isActive: true },
  { id: "2", name: "Pediatrics", head: "Dr. Arjun Patel", phone: "(555) 123-4002", email: "pediatrics@clinicarepro.com", staffCount: 5, description: "Specialized care for infants, children, and adolescents.", isActive: true },
  { id: "3", name: "Dental", head: "Dr. Neha Gupta", phone: "(555) 123-4003", email: "dental@clinicarepro.com", staffCount: 6, description: "General and preventive dental care services.", isActive: true },
  { id: "4", name: "Ophthalmology", head: "Dr. Raj Krishnan", phone: "(555) 123-4004", email: "eye@clinicarepro.com", staffCount: 3, description: "Eye examinations, vision correction, and ocular health.", isActive: true },
  { id: "5", name: "Radiology", head: "Dr. Ananya Rao", phone: "(555) 123-4005", email: "radiology@clinicarepro.com", staffCount: 4, description: "Diagnostic imaging including X-ray, ultrasound, and CT.", isActive: true },
  { id: "6", name: "Laboratory", head: "Dr. Suresh Iyer", phone: "(555) 123-4006", email: "lab@clinicarepro.com", staffCount: 7, description: "Clinical laboratory testing and pathology services.", isActive: false },
];

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Department>>({});

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.head.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() {
    setEditId("new");
    setForm({ name: "", head: "", phone: "", email: "", staffCount: 0, description: "", isActive: true });
  }

  function openEdit(d: Department) {
    setEditId(d.id);
    setForm(d);
  }

  function save() {
    if (!form.name) return;
    if (editId === "new") {
      setDepartments((prev) => [...prev, { ...form, id: Date.now().toString() } as Department]);
    } else {
      setDepartments((prev) => prev.map((d) => (d.id === editId ? { ...d, ...form } : d)));
    }
    setEditId(null);
    setForm({});
  }

  function remove(id: string) {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Departments</h1>
          <p className="text-sm text-muted-foreground">{departments.length} departments</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search departments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {editId && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
          <h2 className="mb-4 font-semibold text-foreground">{editId === "new" ? "Add Department" : "Edit Department"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Department Name</Label>
              <Input value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <Label>Department Head</Label>
              <Input value={form.head || ""} onChange={(e) => setForm((p) => ({ ...p, head: e.target.value }))} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone || ""} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email || ""} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <Label>Staff Count</Label>
              <Input type="number" value={form.staffCount || 0} onChange={(e) => setForm((p) => ({ ...p, staffCount: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Grid Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d) => (
          <div key={d.id} className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">{d.name}</h3>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${d.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {d.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">{d.description}</p>
            <div className="mb-3 space-y-1 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-3 w-3" /> {d.head} &middot; {d.staffCount} staff
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3 w-3" /> {d.phone}
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(d)} className="rounded p-1 hover:bg-muted"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(d.id)} className="rounded p-1 hover:bg-red-50 text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-8 text-center text-muted-foreground">No departments found.</p>
        )}
      </div>
    </div>
  );
}

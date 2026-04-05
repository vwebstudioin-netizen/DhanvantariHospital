"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search, Stethoscope } from "lucide-react";

interface Service {
  id: string;
  name: string;
  department: string;
  description: string;
  duration: string;
  price: string;
  isActive: boolean;
}

const initialServices: Service[] = [
  { id: "1", name: "General Checkup", department: "Family Medicine", description: "Comprehensive annual wellness examination", duration: "30 min", price: "₹1,500", isActive: true },
  { id: "2", name: "Pediatric Vaccination", department: "Pediatrics", description: "Routine childhood immunizations per schedule", duration: "15 min", price: "₹800", isActive: true },
  { id: "3", name: "Dental Cleaning", department: "Dental", description: "Professional dental prophylaxis and examination", duration: "45 min", price: "₹2,000", isActive: true },
  { id: "4", name: "Eye Exam", department: "Ophthalmology", description: "Comprehensive visual acuity and health screening", duration: "30 min", price: "₹1,200", isActive: true },
  { id: "5", name: "X-Ray", department: "Radiology", description: "Digital X-ray imaging for diagnostic purposes", duration: "20 min", price: "₹1,000", isActive: false },
  { id: "6", name: "Blood Panel", department: "Laboratory", description: "Complete blood count and metabolic panel", duration: "10 min", price: "₹900", isActive: true },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Service>>({});

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() {
    setEditId("new");
    setForm({ name: "", department: "", description: "", duration: "", price: "", isActive: true });
  }

  function openEdit(s: Service) {
    setEditId(s.id);
    setForm(s);
  }

  function save() {
    if (!form.name || !form.department) return;
    if (editId === "new") {
      setServices((prev) => [...prev, { ...form, id: Date.now().toString() } as Service]);
    } else {
      setServices((prev) => prev.map((s) => (s.id === editId ? { ...s, ...form } : s)));
    }
    setEditId(null);
    setForm({});
  }

  function remove(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Services</h1>
          <p className="text-sm text-muted-foreground">{services.length} services configured</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search services or departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Edit / New Form */}
      {editId && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
          <h2 className="mb-4 font-semibold text-foreground">{editId === "new" ? "Add New Service" : "Edit Service"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Service Name</Label>
              <Input value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <Label>Department</Label>
              <Input value={form.department || ""} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Input value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <Label>Duration</Label>
              <Input value={form.duration || ""} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} placeholder="e.g. 30 min" />
            </div>
            <div>
              <Label>Price</Label>
              <Input value={form.price || ""} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="e.g. ₹1,500" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Service</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Department</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Duration</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.department}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.duration}</td>
                <td className="px-4 py-3 font-medium text-foreground">{s.price}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${s.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {s.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(s)} className="rounded p-1 hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => remove(s.id)} className="rounded p-1 hover:bg-red-50 text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">No services found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

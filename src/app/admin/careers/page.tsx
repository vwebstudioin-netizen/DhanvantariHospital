"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search, Briefcase, Users, MapPin, IndianRupee } from "lucide-react";

interface CareerListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  applications: number;
  status: "open" | "closed";
  description: string;
}

const initialCareers: CareerListing[] = [
  { id: "1", title: "Registered Nurse", department: "Nursing", location: "Main Campus", type: "Full-time", salary: "₹5,00,000 – ₹7,00,000", posted: "2025-01-10", applications: 24, status: "open", description: "Experienced RN for our family medicine department." },
  { id: "2", title: "Front Desk Receptionist", department: "Administration", location: "Downtown Clinic", type: "Full-time", salary: "₹3,00,000 – ₹4,00,000", posted: "2025-01-20", applications: 42, status: "open", description: "Greet patients and manage appointment scheduling." },
  { id: "3", title: "Lab Technician", department: "Laboratory", location: "Main Campus", type: "Full-time", salary: "₹4,50,000 – ₹6,00,000", posted: "2025-02-01", applications: 15, status: "open", description: "Perform clinical laboratory tests and maintain equipment." },
  { id: "4", title: "Dental Hygienist", department: "Dental", location: "West Side Center", type: "Part-time", salary: "₹3,50,000 – ₹4,50,000", posted: "2024-12-15", applications: 8, status: "closed", description: "Provide dental cleaning and patient education." },
];

export default function AdminCareersPage() {
  const [careers, setCareers] = useState<CareerListing[]>(initialCareers);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<CareerListing>>({});

  const filtered = careers.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.department.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() {
    setEditId("new");
    setForm({ title: "", department: "", location: "", type: "Full-time", salary: "", posted: new Date().toISOString().split("T")[0], applications: 0, status: "open", description: "" });
  }

  function openEdit(c: CareerListing) {
    setEditId(c.id);
    setForm(c);
  }

  function save() {
    if (!form.title || !form.department) return;
    if (editId === "new") {
      setCareers((prev) => [...prev, { ...form, id: Date.now().toString() } as CareerListing]);
    } else {
      setCareers((prev) => prev.map((c) => (c.id === editId ? { ...c, ...form } : c)));
    }
    setEditId(null);
    setForm({});
  }

  function remove(id: string) {
    setCareers((prev) => prev.filter((c) => c.id !== id));
  }

  function toggleStatus(id: string) {
    setCareers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === "open" ? "closed" : "open" } : c))
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Careers</h1>
          <p className="text-sm text-muted-foreground">
            {careers.filter((c) => c.status === "open").length} open positions &middot; {careers.reduce((a, c) => a + c.applications, 0)} total applications
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> Post New Job
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search positions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {editId && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
          <h2 className="mb-4 font-semibold text-foreground">{editId === "new" ? "Post New Job" : "Edit Job Listing"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Job Title</Label>
              <Input value={form.title || ""} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <Label>Department</Label>
              <Input value={form.department || ""} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={form.location || ""} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
            </div>
            <div>
              <Label>Type</Label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={form.type || "Full-time"}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
            <div>
              <Label>Salary Range</Label>
              <Input value={form.salary || ""} onChange={(e) => setForm((p) => ({ ...p, salary: e.target.value }))} placeholder="e.g. ₹5,00,000 – ₹7,00,000" />
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={form.status || "open"}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "open" | "closed" }))}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="sm:col-span-2">
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

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Position</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Salary</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Apps</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.department}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.location}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.type}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> {c.salary}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.applications}</div>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStatus(c.id)}>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${c.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {c.status}
                    </span>
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(c)} className="rounded p-1 hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => remove(c.id)} className="rounded p-1 hover:bg-red-50 text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">No positions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

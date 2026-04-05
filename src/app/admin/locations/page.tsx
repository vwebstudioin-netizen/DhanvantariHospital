"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search, MapPin, Clock, Phone } from "lucide-react";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  services: string;
  isActive: boolean;
}

const initialLocations: Location[] = [
  { id: "1", name: "Main Campus", address: "123 Health Blvd", city: "Mumbai, MH 400001", phone: "(555) 123-4567", hours: "Mon-Fri 8AM-6PM, Sat 9AM-1PM", services: "Full-service clinic, Lab, Pharmacy, Imaging", isActive: true },
  { id: "2", name: "Downtown Clinic", address: "456 Central Ave", city: "Mumbai, MH 400002", phone: "(555) 234-5678", hours: "Mon-Fri 9AM-5PM", services: "Primary Care, Pediatrics, Dental", isActive: true },
  { id: "3", name: "West Side Center", address: "789 Wellness Dr", city: "Mumbai, MH 400058", phone: "(555) 345-6789", hours: "Mon-Sat 8AM-8PM", services: "Urgent Care, Lab, Primary Care", isActive: true },
  { id: "4", name: "North Branch", address: "321 Care Lane", city: "Thane, MH 400601", phone: "(555) 456-7890", hours: "Mon-Fri 9AM-6PM", services: "Primary Care, Ophthalmology", isActive: false },
];

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Location>>({});

  const filtered = locations.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.city.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() {
    setEditId("new");
    setForm({ name: "", address: "", city: "", phone: "", hours: "", services: "", isActive: true });
  }

  function openEdit(l: Location) {
    setEditId(l.id);
    setForm(l);
  }

  function save() {
    if (!form.name || !form.address) return;
    if (editId === "new") {
      setLocations((prev) => [...prev, { ...form, id: Date.now().toString() } as Location]);
    } else {
      setLocations((prev) => prev.map((l) => (l.id === editId ? { ...l, ...form } : l)));
    }
    setEditId(null);
    setForm({});
  }

  function remove(id: string) {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Locations</h1>
          <p className="text-sm text-muted-foreground">{locations.length} locations</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> Add Location
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search locations..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {editId && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
          <h2 className="mb-4 font-semibold text-foreground">{editId === "new" ? "Add Location" : "Edit Location"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Location Name</Label>
              <Input value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone || ""} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <Label>Address</Label>
              <Input value={form.address || ""} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
            </div>
            <div>
              <Label>City / ZIP</Label>
              <Input value={form.city || ""} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
            </div>
            <div>
              <Label>Hours</Label>
              <Input value={form.hours || ""} onChange={(e) => setForm((p) => ({ ...p, hours: e.target.value }))} />
            </div>
            <div>
              <Label>Services Available</Label>
              <Input value={form.services || ""} onChange={(e) => setForm((p) => ({ ...p, services: e.target.value }))} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((l) => (
          <div key={l.id} className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">{l.name}</h3>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${l.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {l.isActive ? "Active" : "Closed"}
              </span>
            </div>
            <p className="mb-1 text-sm text-foreground">{l.address}</p>
            <p className="mb-3 text-xs text-muted-foreground">{l.city}</p>
            <div className="mb-3 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {l.phone}</div>
              <div className="flex items-center gap-2"><Clock className="h-3 w-3" /> {l.hours}</div>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              <strong>Services:</strong> {l.services}
            </p>
            <div className="flex gap-1">
              <button onClick={() => openEdit(l)} className="rounded p-1 hover:bg-muted"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(l.id)} className="rounded p-1 hover:bg-red-50 text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-8 text-center text-muted-foreground">No locations found.</p>
        )}
      </div>
    </div>
  );
}

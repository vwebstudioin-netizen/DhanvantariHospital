"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, User } from "lucide-react";

export default function PortalProfile() {
  const [form, setForm] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-06-15",
    address: "123 Main Street",
    city: "Springfield",
    state: "IL",
    zipCode: "62701",
    emergencyName: "Jane Doe",
    emergencyPhone: "(555) 987-6543",
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">My Profile</h1>

      <div className="rounded-xl border border-border bg-card p-6">
        {/* Avatar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            {form.firstName[0]}{form.lastName[0]}
          </div>
          <div>
            <p className="font-semibold text-foreground">{form.firstName} {form.lastName}</p>
            <p className="text-sm text-muted-foreground">{form.email}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">First Name</label>
            <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Last Name</label>
            <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Phone</label>
            <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Date of Birth</label>
            <Input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Address</label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">City</label>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">State</label>
              <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">ZIP</label>
              <Input value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <h2 className="mb-4 mt-8 text-lg font-semibold text-foreground">Emergency Contact</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Contact Name</label>
            <Input value={form.emergencyName} onChange={(e) => setForm({ ...form, emergencyName: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Contact Phone</label>
            <Input type="tel" value={form.emergencyPhone} onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })} />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button className="gap-2">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

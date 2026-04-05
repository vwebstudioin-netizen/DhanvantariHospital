"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

export default function AdminSettings() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Site Settings</h1>
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold text-foreground">General</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Site Name</label>
              <Input defaultValue="Dhanvantari Hospital" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Phone</label>
              <Input defaultValue="(555) 100-2000" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
              <Input defaultValue="info@clinicarepro.com" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Tagline</label>
              <Input defaultValue="Advanced Multi-Specialty Healthcare" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold text-foreground">Announcement Bar</h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Message</label>
            <Input defaultValue="Now accepting new patients at all 1 location!" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input type="checkbox" id="announcementEnabled" defaultChecked className="h-4 w-4" />
            <label htmlFor="announcementEnabled" className="text-sm text-foreground">Enabled</label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="gap-2"><Save className="h-4 w-4" /> Save Settings</Button>
        </div>
      </div>
    </div>
  );
}

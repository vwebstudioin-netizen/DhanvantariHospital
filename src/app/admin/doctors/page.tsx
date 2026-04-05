"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { doctors } from "@/data/doctors";

export default function AdminDoctors() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Manage Doctors</h1>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Doctor</Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search doctors..." className="pl-10" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-foreground">Name</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Specialty</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Locations</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.slug} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{doc.title} {doc.firstName} {doc.lastName}</td>
                <td className="px-4 py-3">{doc.specialty}</td>
                <td className="px-4 py-3">{doc.locationSlugs.length} location(s)</td>
                <td className="px-4 py-3">
                  <Badge variant={doc.acceptingNewPatients ? "default" : "secondary"}>
                    {doc.acceptingNewPatients ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

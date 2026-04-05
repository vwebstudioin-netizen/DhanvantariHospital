"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const demoJobs = [
  { title: "Registered Nurse — Med/Surg", department: "Nursing", location: "Main Campus", status: "Active", applications: 12 },
  { title: "Medical Assistant", department: "General Medicine", location: "Downtown Clinic", status: "Active", applications: 8 },
  { title: "Physical Therapist", department: "Rehabilitation", location: "Main Campus", status: "Active", applications: 5 },
  { title: "Billing Specialist", department: "Finance", location: "Downtown Clinic", status: "Closed", applications: 15 },
];

export default function AdminJobs() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Job Listings</h1>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> New Job</Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Department</th>
              <th className="px-4 py-3 text-left font-medium">Location</th>
              <th className="px-4 py-3 text-left font-medium">Applications</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {demoJobs.map((job) => (
              <tr key={job.title} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{job.title}</td>
                <td className="px-4 py-3">{job.department}</td>
                <td className="px-4 py-3">{job.location}</td>
                <td className="px-4 py-3">{job.applications}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${job.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

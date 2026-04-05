"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const demoAppointments = [
  { id: "APT-001", patient: "John Doe", doctor: "Dr. Chen", service: "Annual Checkup", date: "Dec 15, 2024", time: "10:00 AM", status: "confirmed" },
  { id: "APT-002", patient: "Maria Garcia", doctor: "Dr. Rodriguez", service: "Cardiology Consult", date: "Dec 15, 2024", time: "11:30 AM", status: "confirmed" },
  { id: "APT-003", patient: "Robert Smith", doctor: "Dr. Park", service: "Orthopedic Eval", date: "Dec 16, 2024", time: "9:00 AM", status: "pending" },
  { id: "APT-004", patient: "Linda Wilson", doctor: "Dr. Patel", service: "Skin Screening", date: "Dec 16, 2024", time: "2:00 PM", status: "confirmed" },
  { id: "APT-005", patient: "James Brown", doctor: "Dr. Johnson", service: "Pediatric Visit", date: "Dec 17, 2024", time: "10:30 AM", status: "cancelled" },
];

const statusColors: Record<string, "default" | "secondary" | "outline"> = {
  confirmed: "default",
  pending: "secondary",
  completed: "outline",
  cancelled: "outline",
};

export default function AdminAppointments() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
        <Button size="sm" className="gap-2">
          <Calendar className="h-4 w-4" /> New Appointment
        </Button>
      </div>

      <div className="mb-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search appointments..." className="pl-10" />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-foreground">ID</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Patient</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Doctor</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Service</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Date</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {demoAppointments.map((appt) => (
              <tr key={appt.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">{appt.id}</td>
                <td className="px-4 py-3">{appt.patient}</td>
                <td className="px-4 py-3">{appt.doctor}</td>
                <td className="px-4 py-3">{appt.service}</td>
                <td className="px-4 py-3">{appt.date} {appt.time}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusColors[appt.status]}>{appt.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

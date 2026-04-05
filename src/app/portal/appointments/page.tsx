"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";

const demoAppointments = [
  { id: "1", service: "Annual Checkup", doctor: "Dr. Sarah Chen", date: "Dec 15, 2024", time: "10:00 AM", location: "Main Campus", status: "confirmed" },
  { id: "2", service: "Follow-up Visit", doctor: "Dr. Michael Rodriguez", date: "Jan 8, 2025", time: "2:30 PM", location: "Main Campus", status: "confirmed" },
  { id: "3", service: "Dermatology Consultation", doctor: "Dr. Aisha Patel", date: "Nov 5, 2024", time: "11:00 AM", location: "Downtown Clinic", status: "completed" },
  { id: "4", service: "Pediatric Checkup", doctor: "Dr. Emily Johnson", date: "Oct 20, 2024", time: "9:30 AM", location: "Main Campus", status: "completed" },
];

const statusColors: Record<string, "default" | "secondary" | "outline"> = {
  confirmed: "default",
  completed: "secondary",
  cancelled: "outline",
};

export default function PortalAppointments() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My Appointments</h1>
        <Link href="/book">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Book New
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {demoAppointments.map((appt) => (
          <Link
            key={appt.id}
            href={`/portal/appointments/${appt.id}`}
            className="block rounded-xl border border-border bg-card p-5 transition hover:border-primary/30"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{appt.service}</h3>
                <p className="text-sm text-muted-foreground">{appt.doctor}</p>
              </div>
              <Badge variant={statusColors[appt.status] || "outline"}>
                {appt.status}
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {appt.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {appt.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {appt.location}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

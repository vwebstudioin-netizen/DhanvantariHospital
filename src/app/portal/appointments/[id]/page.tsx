"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AppointmentDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <Link href="/portal/appointments" className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Appointments
      </Link>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Annual Checkup</h1>
            <p className="text-sm text-muted-foreground">Appointment #{id}</p>
          </div>
          <Badge variant="default">Confirmed</Badge>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-foreground">December 15, 2024</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-foreground">10:00 AM (30 minutes)</span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-foreground">Main Campus</span>
            </p>
            <p className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span className="text-foreground">Dr. Sarah Chen</span>
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <h3 className="mb-2 font-semibold text-foreground text-sm">Preparation Notes</h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Bring photo ID and insurance card</li>
              <li>• List of current medications</li>
              <li>• Arrive 15 minutes early for check-in</li>
              <li>• Fast for 12 hours if bloodwork was ordered</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" size="sm">Reschedule</Button>
          <Button variant="outline" size="sm" className="text-destructive">Cancel</Button>
        </div>
      </div>
    </div>
  );
}

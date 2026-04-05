"use client";

import Link from "next/link";
import { Calendar, MessageSquare, Star, ArrowRight, Clock } from "lucide-react";

export default function PortalDashboard() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">
        Welcome to Your Patient Portal
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Upcoming Appointments */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Upcoming Appointments</h2>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm font-medium text-foreground">Annual Checkup</p>
              <p className="text-xs text-muted-foreground">Dr. Sarah Chen</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                <Clock className="h-3 w-3" /> Dec 15, 2024 at 10:00 AM
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm font-medium text-foreground">Follow-up Visit</p>
              <p className="text-xs text-muted-foreground">Dr. Michael Rodriguez</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                <Clock className="h-3 w-3" /> Jan 8, 2025 at 2:30 PM
              </p>
            </div>
          </div>
          <Link
            href="/portal/appointments"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Messages */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Messages</h2>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm font-medium text-foreground">Lab Results Available</p>
              <p className="text-xs text-muted-foreground">From: Dr. Chen&apos;s Office</p>
              <p className="text-xs text-muted-foreground">2 days ago</p>
            </div>
          </div>
          <Link
            href="/portal/messages"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold text-foreground">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/book"
              className="block rounded-lg border border-border p-3 text-sm text-foreground transition hover:border-primary/30"
            >
              📅 Book New Appointment
            </Link>
            <Link
              href="/portal/messages/new"
              className="block rounded-lg border border-border p-3 text-sm text-foreground transition hover:border-primary/30"
            >
              ✉️ Send a Message
            </Link>
            <Link
              href="/portal/reviews/new"
              className="block rounded-lg border border-border p-3 text-sm text-foreground transition hover:border-primary/30"
            >
              ⭐ Leave a Review
            </Link>
            <Link
              href="/portal/profile"
              className="block rounded-lg border border-border p-3 text-sm text-foreground transition hover:border-primary/30"
            >
              👤 Update Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react";

export default function AdminAnalytics() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Analytics</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <Calendar className="mb-2 h-5 w-5 text-primary" />
          <p className="text-2xl font-bold text-foreground">324</p>
          <p className="text-sm text-muted-foreground">Appointments This Month</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <Users className="mb-2 h-5 w-5 text-primary" />
          <p className="text-2xl font-bold text-foreground">156</p>
          <p className="text-sm text-muted-foreground">New Patients</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <TrendingUp className="mb-2 h-5 w-5 text-primary" />
          <p className="text-2xl font-bold text-foreground">92%</p>
          <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <BarChart3 className="mb-2 h-5 w-5 text-primary" />
          <p className="text-2xl font-bold text-foreground">15,230</p>
          <p className="text-sm text-muted-foreground">Website Visits</p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        <p>Charts and analytics powered by Recharts.</p>
        <p className="mt-2 text-sm">In production, this would display interactive appointment trends, patient demographics, revenue analytics, and department performance.</p>
      </div>
    </div>
  );
}

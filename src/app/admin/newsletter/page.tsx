"use client";

import { Mail, TrendingUp, Users } from "lucide-react";

export default function AdminNewsletter() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Newsletter</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <Users className="mb-2 h-5 w-5 text-primary" />
          <p className="text-2xl font-bold text-foreground">2,547</p>
          <p className="text-sm text-muted-foreground">Total Subscribers</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <Mail className="mb-2 h-5 w-5 text-primary" />
          <p className="text-2xl font-bold text-foreground">12</p>
          <p className="text-sm text-muted-foreground">Campaigns Sent</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <TrendingUp className="mb-2 h-5 w-5 text-primary" />
          <p className="text-2xl font-bold text-foreground">42%</p>
          <p className="text-sm text-muted-foreground">Open Rate</p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        <p>Newsletter subscriber management via Firestore.</p>
        <p className="mt-2 text-sm">Export subscribers, send campaigns, view analytics.</p>
      </div>
    </div>
  );
}

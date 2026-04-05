"use client";

export default function AdminApplications() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Job Applications</h1>
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        <p>Job applications would be managed here via Firestore.</p>
        <p className="mt-2 text-sm">View, filter, and manage incoming applications from career listings.</p>
      </div>
    </div>
  );
}

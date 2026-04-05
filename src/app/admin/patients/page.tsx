"use client";

export default function AdminPatients() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Patients</h1>
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        <p>Patient records management via Firestore.</p>
        <p className="mt-2 text-sm">View and manage patient profiles, appointment history, and communication.</p>
      </div>
    </div>
  );
}

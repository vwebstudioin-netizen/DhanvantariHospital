import type { Metadata } from "next";
import { AlertTriangle, Phone } from "lucide-react";
import { getMaintenanceMessage, getSupportName, getSupportPhone } from "@/lib/payment-mode";

export const metadata: Metadata = {
  title: "Maintenance",
  description: "Website is currently unavailable.",
};

export default function MaintenancePage() {
  const supportName = getSupportName();
  const supportPhone = getSupportPhone();

  return (
    <section className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-16">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <h1 className="text-3xl font-bold text-foreground">Website In Maintenance</h1>
        <p className="mt-3 text-muted-foreground">{getMaintenanceMessage()}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          This website went to maintenance due to pending bill.
        </p>

        <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">Contact for restoration</p>
          <p className="mt-2 text-lg font-semibold text-foreground">{supportName}</p>
          <p className="mt-1 inline-flex items-center gap-2 text-base font-semibold text-foreground">
            <Phone className="h-4 w-4" /> {supportPhone}
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Mail, Smartphone, Save, CheckCircle } from "lucide-react";

export default function PortalNotificationsPage() {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    emailAppointmentReminder: true,
    emailLabResults: true,
    emailBillingStatements: true,
    emailNewsletter: false,
    emailPromotions: false,
    smsAppointmentReminder: true,
    smsLabResults: false,
    smsBillingStatements: false,
  });

  function toggle(key: keyof typeof prefs) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const emailSettings = [
    { key: "emailAppointmentReminder" as const, label: "Appointment Reminders", desc: "Receive email reminders 24 hours before your appointment." },
    { key: "emailLabResults" as const, label: "Lab Results Available", desc: "Get notified when new lab results are ready to view." },
    { key: "emailBillingStatements" as const, label: "Billing Statements", desc: "Receive billing notifications and payment receipts." },
    { key: "emailNewsletter" as const, label: "Monthly Newsletter", desc: "Health tips, clinic news, and community events." },
    { key: "emailPromotions" as const, label: "Special Offers", desc: "Discounts on wellness programs and health screenings." },
  ];

  const smsSettings = [
    { key: "smsAppointmentReminder" as const, label: "Appointment Reminders", desc: "Text reminders sent 2 hours before your appointment." },
    { key: "smsLabResults" as const, label: "Lab Results Available", desc: "Text alert when new results are posted." },
    { key: "smsBillingStatements" as const, label: "Payment Due Alerts", desc: "Text reminder when a payment is due." },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notification Preferences</h1>
        <p className="text-muted-foreground">Manage how and when we communicate with you.</p>
      </div>

      {/* Email Notifications */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Email Notifications</h2>
            <p className="text-xs text-muted-foreground">Sent to your registered email address</p>
          </div>
        </div>
        <div className="space-y-4">
          {emailSettings.map((setting) => (
            <label key={setting.key} className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{setting.label}</p>
                <p className="text-xs text-muted-foreground">{setting.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(setting.key)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  prefs[setting.key] ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
                    prefs[setting.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">SMS / Text Notifications</h2>
            <p className="text-xs text-muted-foreground">Sent to your registered phone number</p>
          </div>
        </div>
        <div className="space-y-4">
          {smsSettings.map((setting) => (
            <label key={setting.key} className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{setting.label}</p>
                <p className="text-xs text-muted-foreground">{setting.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(setting.key)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  prefs[setting.key] ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
                    prefs[setting.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" /> Save Preferences
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" /> Preferences saved!
          </span>
        )}
      </div>
    </div>
  );
}

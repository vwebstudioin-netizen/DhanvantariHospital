"use client";

import { useState, useEffect } from "react";
import { Mail, Smartphone, Save, CheckCircle, Bell } from "lucide-react";
import { useAuthContext } from "@/providers/AuthProvider";
import { getPatient, updatePatient } from "@/lib/patients";
import toast from "react-hot-toast";

const DEFAULT_PREFS = {
  emailAppointmentReminder: true,
  emailLabResults: true,
  emailBillingStatements: true,
  emailNewsletter: false,
  smsAppointmentReminder: true,
  smsBillingStatements: false,
};

export default function PortalNotificationsPage() {
  const { user } = useAuthContext();
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load saved prefs from patient record
  useEffect(() => {
    if (!user) return;
    getPatient(user.uid).then(pat => {
      const p = pat as any;
      if (p?.notificationPrefs) setPrefs({ ...DEFAULT_PREFS, ...p.notificationPrefs });
    }).catch(() => {});
  }, [user]);

  const toggle = (key: keyof typeof prefs) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updatePatient(user.uid, { notificationPrefs: prefs } as any);
      setSaved(true);
      toast.success("Notification preferences saved");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ k }: { k: keyof typeof prefs }) => (
    <button type="button" onClick={() => toggle(k)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${prefs[k] ? "bg-primary" : "bg-muted"}`}>
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${prefs[k] ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notification Preferences</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage how the hospital communicates with you.</p>
      </div>

      {/* Email */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Email Notifications</p>
            <p className="text-xs text-muted-foreground">Sent to {user?.email}</p>
          </div>
        </div>
        <div className="space-y-3">
          {([
            { key: "emailAppointmentReminder", label: "Appointment Reminders", desc: "Email reminder 24 hours before your appointment" },
            { key: "emailLabResults",           label: "Lab Results",           desc: "Notified when lab results are available" },
            { key: "emailBillingStatements",    label: "Billing Statements",    desc: "Invoice and payment notifications" },
            { key: "emailNewsletter",           label: "Health Newsletter",     desc: "Monthly health tips and hospital news" },
          ] as { key: keyof typeof prefs; label: string; desc: string }[]).map(s => (
            <div key={s.key} className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <Toggle k={s.key} />
            </div>
          ))}
        </div>
      </div>

      {/* SMS / WhatsApp */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">WhatsApp / SMS Notifications</p>
            <p className="text-xs text-muted-foreground">Sent to your registered phone number</p>
          </div>
        </div>
        <div className="space-y-3">
          {([
            { key: "smsAppointmentReminder", label: "Appointment Reminders", desc: "WhatsApp reminder before your appointment" },
            { key: "smsBillingStatements",   label: "Payment Alerts",        desc: "WhatsApp notification when payment is due" },
          ] as { key: keyof typeof prefs; label: string; desc: string }[]).map(s => (
            <div key={s.key} className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <Toggle k={s.key} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-50 transition-colors">
          <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Preferences"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" /> Saved!
          </span>
        )}
      </div>
    </div>
  );
}

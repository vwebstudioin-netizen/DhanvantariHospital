"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MessageSquare, Star, ArrowRight, Phone } from "lucide-react";
import { auth } from "@/lib/firebase";
import { getPatient, updatePatient } from "@/lib/patients";
import toast from "react-hot-toast";

function PhonePrompt({ uid, onDone }: { uid: string; onDone: () => void }) {
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!phone.trim() || phone.length < 10) { toast.error("Enter a valid 10-digit phone number"); return; }
    setSaving(true);
    try {
      await updatePatient(uid, { phone: phone.trim() });
      toast.success("Phone number saved!");
      onDone();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-center gap-2 mb-2">
        <Phone className="h-4 w-4 text-amber-600" />
        <h3 className="font-semibold text-amber-800">Add Your Phone Number</h3>
      </div>
      <p className="text-sm text-amber-700 mb-3">
        Add your phone number so we can send appointment reminders and WhatsApp notifications.
      </p>
      <div className="flex gap-3">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="9876543210"
          maxLength={10}
          className="flex-1 border border-amber-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button onClick={onDone} className="px-3 py-2 text-sm text-amber-600 hover:underline">
          Skip
        </button>
      </div>
    </div>
  );
}

export default function PortalDashboard() {
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    getPatient(user.uid).then((patient) => {
      if (patient && !patient.phone) setShowPhonePrompt(true);
    });
  }, [user]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        Welcome{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}!
      </h1>
      <p className="text-muted-foreground text-sm mb-6">Your patient portal</p>

      {showPhonePrompt && (
        <PhonePrompt uid={user!.uid} onDone={() => setShowPhonePrompt(false)} />
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Appointments</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">View and manage your appointments.</p>
          <Link href="/portal/appointments" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View appointments <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Queue Status</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Check your token position in the queue.</p>
          <Link href="/queue" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Check queue <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Messages</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">View messages from the hospital.</p>
          <Link href="/portal/messages" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View messages <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Leave a Review</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Share your experience with us.</p>
          <Link href="/reviews/submit" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Write review <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

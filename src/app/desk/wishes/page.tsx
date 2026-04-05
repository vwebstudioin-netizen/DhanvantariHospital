"use client";

import { useState, useEffect } from "react";
import { Gift, Send, Users, CheckCircle } from "lucide-react";
import { addDoc, getDocs, collection, Timestamp, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FESTIVE_OCCASIONS, SITE_NAME } from "@/lib/constants";
import toast from "react-hot-toast";

const DEFAULT_MESSAGES: Record<string, string> = {
  "Diwali": "Dear {name}, wishing you and your family a joyful and prosperous Diwali! May this festival of lights bring good health and happiness. — {hospital}",
  "New Year": "Dear {name}, Happy New Year! May the coming year bring you good health, happiness, and prosperity. — {hospital}",
  "Eid": "Dear {name}, Eid Mubarak! Wishing you and your family a blessed and joyful celebration. — {hospital}",
  "Christmas": "Dear {name}, Merry Christmas and Happy New Year! May this festive season bring you joy and good health. — {hospital}",
  "Pongal": "Dear {name}, Happy Pongal! May the harvest festival bring you prosperity and good health. — {hospital}",
  "default": "Dear {name}, warm greetings from {hospital}! Wishing you good health and happiness on this special occasion.",
};

interface Campaign {
  id: string;
  occasion: string;
  recipientCount: number;
  successCount?: number;
  status: string;
  sentAt: any;
}

export default function WishesPage() {
  const [occasion, setOccasion] = useState(FESTIVE_OCCASIONS[0] as string);
  const [message, setMessage] = useState(
    (DEFAULT_MESSAGES[FESTIVE_OCCASIONS[0]] || DEFAULT_MESSAGES.default).replace("{hospital}", SITE_NAME)
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [sendProgress, setSendProgress] = useState<{ sent: number; total: number } | null>(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    try {
      const q = query(collection(db, "wishCampaigns"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setCampaigns(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Campaign));
    } catch { /* ignore */ }
  }

  const handleOccasionChange = (occ: string) => {
    setOccasion(occ);
    setMessage((DEFAULT_MESSAGES[occ] || DEFAULT_MESSAGES.default).replace("{hospital}", SITE_NAME));
  };

  const handleSend = async () => {
    if (!message.trim()) { toast.error("Write a message first"); return; }
    setSending(true);
    setSendProgress(null);
    try {
      // Fetch all patient phone numbers
      const patientsSnap = await getDocs(collection(db, "patients"));
      const patients = patientsSnap.docs
        .map((d) => ({ name: d.data().name || "Patient", phone: d.data().phone || "" }))
        .filter((p) => p.phone && p.phone.length >= 10);

      const total = patients.length;
      setSendProgress({ sent: 0, total });

      let successCount = 0;

      // Send in batches via API
      for (const patient of patients) {
        try {
          const personalised = message
            .replace(/{name}/g, patient.name)
            .replace(/{hospital}/g, SITE_NAME);

          const res = await fetch("/api/whatsapp/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: patient.phone, message: personalised }),
          });
          if (res.ok) successCount++;
          setSendProgress((prev) => prev ? { ...prev, sent: prev.sent + 1 } : null);

          // Small delay to avoid rate limiting
          await new Promise((r) => setTimeout(r, 200));
        } catch { /* skip individual failures */ }
      }

      // Save campaign record
      await addDoc(collection(db, "wishCampaigns"), {
        occasion,
        message,
        sentAt: Timestamp.now(),
        recipientCount: total,
        successCount,
        status: total === 0 ? "no_patients" : "sent",
        createdBy: "Desk Staff",
        createdAt: Timestamp.now(),
      });

      setSent(true);
      setSendProgress(null);
      loadCampaigns();

      if (total === 0) {
        toast.error("No patients with phone numbers found. Add patient phones first.");
      } else {
        toast.success(`${successCount}/${total} wishes sent for ${occasion}!`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send wishes");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-green-800">{occasion} Wishes Sent!</h3>
          <p className="text-green-600 mt-1">WhatsApp messages sent to all patients with phone numbers.</p>
          <button onClick={() => { setSent(false); }}
            className="mt-4 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a]">
            Send Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <Gift className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Festive Wishes</h2>
          <p className="text-slate-500 text-sm">Send WhatsApp greetings to all patients</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Occasion</label>
          <div className="flex flex-wrap gap-2">
            {FESTIVE_OCCASIONS.map((occ) => (
              <button key={occ} onClick={() => handleOccasionChange(occ as string)}
                className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors ${
                  occasion === occ
                    ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                    : "text-slate-600 border-slate-200 hover:border-[#1e3a5f] hover:text-[#1e3a5f]"
                }`}>{occ as string}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Message <span className="text-xs text-slate-400">(use {"{name}"} for patient name)</span>
          </label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none" />
        </div>

        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Preview</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">
            {message.replace(/{name}/g, "Patient Name").replace(/{hospital}/g, SITE_NAME)}
          </p>
        </div>

        {sendProgress && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700 font-medium">
              Sending... {sendProgress.sent} / {sendProgress.total}
            </p>
            <div className="mt-2 h-2 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all"
                style={{ width: `${sendProgress.total > 0 ? (sendProgress.sent / sendProgress.total) * 100 : 0}%` }} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users className="w-4 h-4" />
            <span>Sent to all patients with phone numbers via WhatsApp</span>
          </div>
          <button onClick={handleSend} disabled={sending}
            className="flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] transition-colors disabled:opacity-50">
            <Send className="w-4 h-4" />
            {sending ? "Sending..." : `Send ${occasion} Wishes`}
          </button>
        </div>
      </div>

      {/* Past campaigns from Firestore */}
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h3 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wider">Past Campaigns</h3>
        {campaigns.length === 0 ? (
          <p className="text-sm text-slate-400">No campaigns sent yet.</p>
        ) : (
          <div className="space-y-2">
            {campaigns.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="font-medium text-slate-800 text-sm">{c.occasion}</p>
                  <p className="text-xs text-slate-400">
                    {c.sentAt?.toDate?.()?.toLocaleDateString("en-IN") || "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">
                    {c.successCount ?? 0}/{c.recipientCount}
                  </p>
                  <p className="text-xs text-slate-400">delivered</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

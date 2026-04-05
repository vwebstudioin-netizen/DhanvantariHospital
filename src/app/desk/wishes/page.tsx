"use client";

import { useState } from "react";
import { Gift, Send, Users, CheckCircle } from "lucide-react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FESTIVE_OCCASIONS } from "@/lib/constants";
import toast from "react-hot-toast";

// Sample past campaigns
const PAST_CAMPAIGNS = [
  { id: "1", occasion: "New Year", recipientCount: 245, successCount: 238, status: "sent", sentAt: "2026-01-01" },
  { id: "2", occasion: "Diwali", recipientCount: 198, successCount: 195, status: "sent", sentAt: "2025-11-01" },
];

const DEFAULT_MESSAGES: Record<string, string> = {
  "Diwali": "Dear {name}, wishing you and your family a joyful and prosperous Diwali! May this festival of lights bring good health and happiness to your home.",
  "New Year": "Dear {name}, wishing you a Happy New Year! May the coming year bring you good health, happiness, and prosperity.",
  "Eid": "Dear {name}, Eid Mubarak! Wishing you and your family a blessed and joyful celebration.",
  "Christmas": "Dear {name}, wishing you a Merry Christmas and a Happy New Year! May this festive season bring you joy and good health.",
  "Pongal": "Dear {name}, Happy Pongal! May the harvest festival bring you prosperity and good health.",
  "default": "Dear {name}, warm greetings from our team! Wishing you good health and happiness on this special occasion.",
};

export default function WishesPage() {
  const [occasion, setOccasion] = useState(FESTIVE_OCCASIONS[0] as string);
  const [message, setMessage] = useState(DEFAULT_MESSAGES[FESTIVE_OCCASIONS[0]] || DEFAULT_MESSAGES.default);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleOccasionChange = (occ: string) => {
    setOccasion(occ);
    setMessage(DEFAULT_MESSAGES[occ] || DEFAULT_MESSAGES.default);
  };

  const handleSend = async () => {
    if (!message.trim()) { toast.error("Write a message first"); return; }
    setSending(true);
    try {
      // In production: fetch all patient phones from Firestore and call sendBulkWishes()
      // For now we save the campaign record and simulate the send
      await addDoc(collection(db, "wishCampaigns"), {
        occasion,
        message,
        sentAt: Timestamp.now(),
        recipientCount: 0,    // will be updated by server action in production
        successCount: 0,
        status: "sent",
        createdBy: "Desk Staff",
        createdAt: Timestamp.now(),
      });
      setSent(true);
      toast.success(`Festive wishes campaign created for ${occasion}!`);
    } catch {
      toast.error("Failed to send wishes");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-green-800">Wishes Sent!</h3>
          <p className="text-green-600 mt-1">Your {occasion} wishes are being sent to all patients.</p>
          <button
            onClick={() => { setSent(false); setOccasion(FESTIVE_OCCASIONS[0] as string); setMessage(DEFAULT_MESSAGES[FESTIVE_OCCASIONS[0]] || DEFAULT_MESSAGES.default); }}
            className="mt-4 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a]"
          >
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
          <p className="text-slate-500 text-sm">Send wishes to all patients via WhatsApp</p>
        </div>
      </div>

      {/* Compose */}
      <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Occasion</label>
          <div className="flex flex-wrap gap-2">
            {FESTIVE_OCCASIONS.map((occ) => (
              <button
                key={occ}
                onClick={() => handleOccasionChange(occ as string)}
                className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors ${
                  occasion === occ
                    ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                    : "text-slate-600 border-slate-200 hover:border-[#1e3a5f] hover:text-[#1e3a5f]"
                }`}
              >
                {occ as string}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Message{" "}
            <span className="text-xs text-slate-400">(use {"{name}"} for patient name)</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none"
          />
        </div>

        {/* Preview */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Preview</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">
            {message.replace(/{name}/g, "Patient Name")}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users className="w-4 h-4" />
            <span>Will be sent to all registered patients</span>
          </div>
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {sending ? "Sending..." : `Send ${occasion} Wishes`}
          </button>
        </div>
      </div>

      {/* Past campaigns */}
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h3 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wider">Past Campaigns</h3>
        <div className="space-y-2">
          {PAST_CAMPAIGNS.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div>
                <p className="font-medium text-slate-800">{c.occasion}</p>
                <p className="text-xs text-slate-400">{c.sentAt}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-600">{c.successCount}/{c.recipientCount}</p>
                <p className="text-xs text-slate-400">delivered</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

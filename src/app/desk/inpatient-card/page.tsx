"use client";

import { useState, useEffect, useRef } from "react";
import { format, differenceInDays } from "date-fns";
import { Plus, Printer, Phone, XCircle, Search } from "lucide-react";
import { createInPatientCard, getActiveCards, dischargePatient } from "@/lib/inpatient";
import { SITE_NAME, INPATIENT_WARDS } from "@/lib/constants";

async function sendCardWhatsApp(card: { patientPhone: string; patientName: string; cardNumber: string; ward: string; roomNumber: string; expiryDate: string }) {
  const message = `Hello ${card.patientName},\n\n${SITE_NAME} — In-Patient Card Details:\n\n🏥 Card No: *${card.cardNumber}*\n🛏 Ward: ${card.ward}, Room: ${card.roomNumber}\n📅 Valid until: ${card.expiryDate}\n\nGet well soon!`;
  await fetch("/api/whatsapp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: card.patientPhone, message }),
  });
}
import type { InPatientCard } from "@/types/inpatient";
import toast from "react-hot-toast";

function ExpiryBadge({ expiryDate }: { expiryDate: string }) {
  const days = differenceInDays(new Date(expiryDate), new Date());
  if (days < 0) return <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">Expired</span>;
  if (days <= 3) return <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">{days}d left</span>;
  return <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">{days}d left</span>;
}

function PrintableCard({ card }: { card: InPatientCard }) {
  return (
    <div style={{ width: "85.6mm", minHeight: "54mm", border: "2px solid #1e3a5f", padding: "8px 12px", fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#1e293b", background: "#fff" }}>
      <div style={{ borderBottom: "1.5px solid #1e3a5f", paddingBottom: "4px", marginBottom: "6px" }}>
        <div style={{ fontWeight: "900", fontSize: "13px", color: "#1e3a5f", textTransform: "uppercase", letterSpacing: "1px" }}>{SITE_NAME}</div>
        <div style={{ fontSize: "9px", color: "#64748b" }}>In-Patient Card</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
        <div><span style={{ color: "#64748b" }}>Card No: </span><strong>{card.cardNumber}</strong></div>
        <div><span style={{ color: "#64748b" }}>Patient ID: </span><strong>{card.patientId}</strong></div>
        <div style={{ gridColumn: "1 / -1" }}><span style={{ color: "#64748b" }}>Name: </span><strong>{card.patientName}</strong></div>
        <div><span style={{ color: "#64748b" }}>Doctor: </span>{card.doctorName}</div>
        <div><span style={{ color: "#64748b" }}>Ward: </span>{card.ward}</div>
        <div><span style={{ color: "#64748b" }}>Room: </span>{card.roomNumber}</div>
        <div><span style={{ color: "#64748b" }}>Diagnosis: </span>{card.diagnosis}</div>
        <div><span style={{ color: "#64748b" }}>Admitted: </span>{card.admissionDate}</div>
      </div>
      <div style={{ borderTop: "1px solid #e2e8f0", marginTop: "6px", paddingTop: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "9px", color: "#64748b" }}>Valid until:</span>
        <strong style={{ color: "#dc2626", fontSize: "12px" }}>{card.expiryDate}</strong>
      </div>
    </div>
  );
}

export default function InPatientCardPage() {
  const [cards, setCards] = useState<InPatientCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [printCard, setPrintCard] = useState<InPatientCard | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    patientName: "",
    patientPhone: "",
    doctorName: "",
    ward: INPATIENT_WARDS[0] as string,
    roomNumber: "",
    diagnosis: "",
    notes: "",
    admissionDate: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
    setLoading(true);
    try {
      const data = await getActiveCards();
      setCards(data);
    } catch {
      toast.error("Failed to load cards");
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.patientName || !form.doctorName || !form.roomNumber || !form.diagnosis) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const { cardNumber } = await createInPatientCard({
        ...form,
        issuedBy: "Desk Staff",
      });

      // Send WhatsApp if phone provided
      if (form.patientPhone) {
        const expiryDate = format(new Date(new Date(form.admissionDate).getTime() + 14 * 86400000), "yyyy-MM-dd");
        await sendCardWhatsApp({ patientPhone: form.patientPhone, patientName: form.patientName, cardNumber, ward: form.ward, roomNumber: form.roomNumber, expiryDate }).catch(() => {});
      }

      toast.success(`Card ${cardNumber} created!`);
      setShowForm(false);
      setForm({
        patientName: "", patientPhone: "", doctorName: "",
        ward: INPATIENT_WARDS[0] as string, roomNumber: "",
        diagnosis: "", notes: "",
        admissionDate: format(new Date(), "yyyy-MM-dd"),
      });
      loadCards();
    } catch {
      toast.error("Failed to create card");
    } finally {
      setSaving(false);
    }
  };

  const handleDischarge = async (cardId: string, cardNumber: string) => {
    if (!confirm(`Discharge patient (${cardNumber})?`)) return;
    await dischargePatient(cardId);
    toast.success("Patient discharged");
    loadCards();
  };

  const handlePrint = (card: InPatientCard) => {
    setPrintCard(card);
    setTimeout(() => {
      window.print();
      setPrintCard(null);
    }, 200);
  };

  const filtered = cards.filter(
    (c) =>
      c.patientName.toLowerCase().includes(search.toLowerCase()) ||
      c.cardNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.patientId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Print overlay */}
      {printCard && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center print:static print:inset-auto" ref={printRef}>
          <PrintableCard card={printCard} />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">In-Patient Cards</h2>
          <p className="text-slate-500 text-sm">{cards.length} active cards</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Card
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
          <h3 className="font-semibold text-slate-800">Issue New In-Patient Card</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Patient Name *", key: "patientName", placeholder: "Full name" },
              { label: "Phone (for WhatsApp)", key: "patientPhone", placeholder: "9876543210" },
              { label: "Doctor Name *", key: "doctorName", placeholder: "Dr. Name" },
              { label: "Room Number *", key: "roomNumber", placeholder: "101" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
                <input
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Ward *</label>
              <select
                value={form.ward}
                onChange={(e) => setForm({ ...form, ward: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              >
                {INPATIENT_WARDS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Admission Date *</label>
              <input
                type="date"
                value={form.admissionDate}
                onChange={(e) => setForm({ ...form, admissionDate: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Diagnosis *</label>
              <input
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                placeholder="Primary diagnosis"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Additional notes"
                rows={2}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] transition-colors disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Card"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, card number or patient ID..."
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
        />
      </div>

      {/* Cards list */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">No active cards found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((card) => (
            <div key={card.id} className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#1e3a5f]">{card.cardNumber}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{card.patientId}</span>
                    <ExpiryBadge expiryDate={card.expiryDate} />
                  </div>
                  <p className="font-semibold text-slate-800 mt-1">{card.patientName}</p>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Dr. {card.doctorName}</span>
                    <span>{card.ward}, Room {card.roomNumber}</span>
                    <span>{card.diagnosis}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Admitted: {card.admissionDate} → Expires: {card.expiryDate}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handlePrint(card)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print
                  </button>
                  {card.patientPhone && (
                    <button
                      onClick={() =>
                        sendCardWhatsApp({ patientPhone: card.patientPhone, patientName: card.patientName, cardNumber: card.cardNumber, ward: card.ward, roomNumber: card.roomNumber, expiryDate: card.expiryDate }).then(() => toast.success("WhatsApp sent!"))
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      WhatsApp
                    </button>
                  )}
                  {card.patientPhone && (
                    <button
                      onClick={async () => {
                        const res = await fetch("/api/whatsapp/send", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            phone: card.patientPhone,
                            message: `Thank you for choosing Dhanvantari Hospital! We hope you are recovering well.\n\nPlease share your experience ⭐\n${window.location.origin}/reviews/submit?ref=${card.cardNumber}&name=${encodeURIComponent(card.patientName)}`,
                          }),
                        });
                        if (res.ok) toast.success("Review request sent!");
                        else toast.error("Failed to send");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      ⭐ Review
                    </button>
                  )}
                  <button
                    onClick={() => handleDischarge(card.id, card.cardNumber)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Discharge
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

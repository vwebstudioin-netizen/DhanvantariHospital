"use client";

import { useState, useEffect } from "react";
import { format, differenceInDays, addDays } from "date-fns";
import { Plus, Printer, Phone, XCircle, Search, BedDouble, CalendarCheck } from "lucide-react";
import { createInPatientCard, getActiveCards, dischargePatient } from "@/lib/inpatient";
import { issueToken } from "@/lib/queue";
import { SITE_NAME, CONTACT_PHONE, INPATIENT_WARDS } from "@/lib/constants";
import type { InPatientCard, CardType } from "@/types/inpatient";
import toast from "react-hot-toast";

// ── Whatsapp helper ──────────────────────────────────────────────────────────
async function sendCardWhatsApp(card: InPatientCard) {
  let message = "";
  if (card.type === "room") {
    message = `Hello ${card.patientName},\n\n${SITE_NAME} — Admission Details:\n\n🏥 Card No: *${card.cardNumber}*\n🛏 Ward: ${card.ward}, Room: ${card.roomNumber}${card.bedNumber ? `, Bed: ${card.bedNumber}` : ""}\n📅 Admitted: ${card.admissionDate}\n\nGet well soon! For assistance: ${CONTACT_PHONE}`;
  } else {
    message = `Hello ${card.patientName},\n\n${SITE_NAME} — Visit Card:\n\n📋 Card No: *${card.cardNumber}*\n📅 Valid until: ${card.expiryDate}\n\nPlease carry this card for follow-up visits. Ph: ${CONTACT_PHONE}`;
  }
  await fetch("/api/whatsapp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: card.patientPhone, message }),
  });
}

// ── Printable Room Card ──────────────────────────────────────────────────────
function PrintableRoomCard({ card }: { card: InPatientCard }) {
  return (
    <div style={{ width: "85.6mm", minHeight: "54mm", border: "2px solid #1e3a5f", padding: "8px 12px", fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#1e293b", background: "#fff" }}>
      <div style={{ borderBottom: "1.5px solid #1e3a5f", paddingBottom: "4px", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
        <img src="/images/logo.jpg" alt="Logo" style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: "900", fontSize: "10px", color: "#1e3a5f", textTransform: "uppercase", letterSpacing: "1px" }}>{SITE_NAME}</div>
          <div style={{ fontSize: "7px", color: "#64748b" }}>Room Admission Card</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px" }}>
        <div><span style={{ color: "#64748b" }}>Card No: </span><strong>{card.cardNumber}</strong></div>
        <div><span style={{ color: "#64748b" }}>Patient ID: </span><strong>{card.patientId}</strong></div>
        <div style={{ gridColumn: "1/-1" }}><span style={{ color: "#64748b" }}>Name: </span><strong>{card.patientName}</strong></div>
        <div><span style={{ color: "#64748b" }}>Doctor: </span>{card.doctorName}</div>
        <div><span style={{ color: "#64748b" }}>Ward: </span>{card.ward}</div>
        <div><span style={{ color: "#64748b" }}>Room: </span>{card.roomNumber}</div>
        {card.bedNumber && <div><span style={{ color: "#64748b" }}>Bed: </span>{card.bedNumber}</div>}
        <div style={{ gridColumn: "1/-1" }}><span style={{ color: "#64748b" }}>Diagnosis: </span>{card.diagnosis}</div>
        <div><span style={{ color: "#64748b" }}>Admitted: </span>{card.admissionDate}</div>
      </div>
      <div style={{ borderTop: "1px solid #e2e8f0", marginTop: "5px", paddingTop: "3px", fontSize: "8px", color: "#94a3b8", textAlign: "center" }}>
        Active until discharged by hospital staff
      </div>
    </div>
  );
}

// ── Printable Visit Card ─────────────────────────────────────────────────────
function PrintableVisitCard({ card }: { card: InPatientCard }) {
  return (
    <div style={{ width: "85.6mm", minHeight: "54mm", border: "2px solid #16a34a", padding: "8px 12px", fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#1e293b", background: "#fff" }}>
      <div style={{ borderBottom: "1.5px solid #16a34a", paddingBottom: "4px", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
        <img src="/images/logo.jpg" alt="Logo" style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: "900", fontSize: "10px", color: "#16a34a", textTransform: "uppercase", letterSpacing: "1px" }}>{SITE_NAME}</div>
          <div style={{ fontSize: "7px", color: "#64748b" }}>OPD Visit Card</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px" }}>
        <div><span style={{ color: "#64748b" }}>Card No: </span><strong>{card.cardNumber}</strong></div>
        <div><span style={{ color: "#64748b" }}>Patient ID: </span><strong>{card.patientId}</strong></div>
        <div style={{ gridColumn: "1/-1" }}><span style={{ color: "#64748b" }}>Name: </span><strong>{card.patientName}</strong></div>
        <div><span style={{ color: "#64748b" }}>Doctor: </span>{card.doctorName}</div>
        <div><span style={{ color: "#64748b" }}>Visit Date: </span>{card.admissionDate}</div>
        <div style={{ gridColumn: "1/-1" }}><span style={{ color: "#64748b" }}>Purpose: </span>{card.diagnosis}</div>
      </div>
      <div style={{ borderTop: "1px solid #e2e8f0", marginTop: "5px", paddingTop: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "8px", color: "#64748b" }}>Valid for follow-up until:</span>
        <strong style={{ color: "#dc2626", fontSize: "12px" }}>{card.expiryDate}</strong>
      </div>
    </div>
  );
}

// ── Expiry Badge (visit cards only) ─────────────────────────────────────────
function ExpiryBadge({ expiryDate }: { expiryDate: string }) {
  const days = differenceInDays(new Date(expiryDate), new Date());
  if (days < 0) return <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">Expired</span>;
  if (days <= 3) return <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">{days}d left</span>;
  return <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">{days}d left</span>;
}

// ── Card List Item ───────────────────────────────────────────────────────────
function CardItem({ card, onPrint, onDischarge, onWhatsApp, onReview }: {
  card: InPatientCard;
  onPrint: () => void;
  onDischarge: () => void;
  onWhatsApp: () => void;
  onReview: () => void;
}) {
  const isRoom = card.type === "room";
  return (
    <div className={`bg-white rounded-xl border p-4 ${isRoom ? "border-blue-100 border-l-4 border-l-[#1e3a5f]" : "border-green-100 border-l-4 border-l-green-600"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isRoom ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
              {isRoom ? "🛏 Room" : "📋 Visit"}
            </span>
            <span className={`font-bold text-sm ${isRoom ? "text-[#1e3a5f]" : "text-green-700"}`}>{card.cardNumber}</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">{card.patientId}</span>
            {!isRoom && card.expiryDate && <ExpiryBadge expiryDate={card.expiryDate} />}
            {isRoom && <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">Admitted</span>}
          </div>
          <p className="font-semibold text-slate-800">{card.patientName}</p>
          <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-x-3">
            <span>Dr. {card.doctorName}</span>
            {isRoom ? (
              <>
                <span>{card.ward}</span>
                <span>Room {card.roomNumber}{card.bedNumber ? `, Bed ${card.bedNumber}` : ""}</span>
              </>
            ) : (
              <span>Visit: {card.admissionDate}</span>
            )}
            <span>{card.diagnosis}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <button onClick={onPrint} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          {card.patientPhone && (
            <>
              <button onClick={onWhatsApp} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 border border-green-200 rounded-lg hover:bg-green-50">
                <Phone className="w-3.5 h-3.5" /> WhatsApp
              </button>
              <button onClick={onReview} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-50">
                ⭐ Review
              </button>
            </>
          )}
          <button onClick={onDischarge} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
            <XCircle className="w-3.5 h-3.5" /> {isRoom ? "Discharge" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function InPatientCardPage() {
  const [cards, setCards] = useState<InPatientCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CardType>("room");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [printCard, setPrintCard] = useState<InPatientCard | null>(null);

  const [roomForm, setRoomForm] = useState({
    patientName: "", patientPhone: "", doctorName: "",
    ward: INPATIENT_WARDS[0] as string, roomNumber: "", bedNumber: "",
    diagnosis: "", notes: "",
    admissionDate: format(new Date(), "yyyy-MM-dd"),
  });

  const [visitForm, setVisitForm] = useState({
    patientName: "", patientPhone: "", doctorName: "",
    diagnosis: "", notes: "",
    admissionDate: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => { loadCards(); }, []);

  async function loadCards() {
    setLoading(true);
    try {
      const data = await getActiveCards();
      setCards(data);
    } catch { toast.error("Failed to load cards"); }
    finally { setLoading(false); }
  }

  const handleCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const form = activeTab === "room" ? roomForm : visitForm;
    if (!form.patientName || !form.doctorName || !form.diagnosis) {
      toast.error("Please fill all required fields"); return;
    }
    if (activeTab === "room" && !roomForm.roomNumber) {
      toast.error("Room number is required for Room Card"); return;
    }
    setSaving(true);
    try {
      const payload: any = { type: activeTab, ...form, issuedBy: "Desk Staff" };
      const { cardNumber } = await createInPatientCard(payload);

      // Visit card → auto-issue a token in today's queue
      let tokenNumber = "";
      if (activeTab === "visit") {
        try {
          const token = await issueToken(
            form.patientName,
            form.patientPhone || "",
            `OPD Visit — Dr. ${form.doctorName} — ${form.diagnosis}`
          );
          tokenNumber = token.displayNumber;
        } catch {
          // Token issue failure should not block card creation
        }
      }

      // Send WhatsApp notification
      if (form.patientPhone) {
        const tmpCard = { ...payload, cardNumber, patientId: "", id: "", isActive: true, createdAt: null, updatedAt: null };
        if (activeTab === "visit") {
          const expiryDate = format(addDays(new Date(form.admissionDate), 14), "yyyy-MM-dd");
          tmpCard.expiryDate = expiryDate;
        }
        await sendCardWhatsApp(tmpCard as InPatientCard).catch(() => {});
      }

      const successMsg = activeTab === "visit" && tokenNumber
        ? `Visit Card ${cardNumber} created! Token #${tokenNumber} added to queue.`
        : `${activeTab === "room" ? "Room" : "Visit"} Card ${cardNumber} created!`;
      toast.success(successMsg);
      setShowForm(false);
      activeTab === "room"
        ? setRoomForm({ patientName: "", patientPhone: "", doctorName: "", ward: INPATIENT_WARDS[0] as string, roomNumber: "", bedNumber: "", diagnosis: "", notes: "", admissionDate: format(new Date(), "yyyy-MM-dd") })
        : setVisitForm({ patientName: "", patientPhone: "", doctorName: "", diagnosis: "", notes: "", admissionDate: format(new Date(), "yyyy-MM-dd") });
      loadCards();
    } catch { toast.error("Failed to create card"); }
    finally { setSaving(false); }
  };

  const handleDischarge = async (card: InPatientCard) => {
    const action = card.type === "room" ? "Discharge" : "Close";
    if (!confirm(`${action} patient (${card.cardNumber})?`)) return;
    await dischargePatient(card.id);
    toast.success(`Patient ${action.toLowerCase()}d`);
    loadCards();
  };

  const handlePrint = (card: InPatientCard) => {
    setPrintCard(card);
    setTimeout(() => { window.print(); setPrintCard(null); }, 300);
  };

  const handleReview = async (card: InPatientCard) => {
    const res = await fetch("/api/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: card.patientPhone,
        message: `Thank you for visiting ${SITE_NAME}! We hope you are well.\n\n⭐ Please share your experience:\n${window.location.origin}/reviews/submit?ref=${card.cardNumber}&name=${encodeURIComponent(card.patientName)}`,
      }),
    });
    if (res.ok) toast.success("Review request sent!"); else toast.error("Failed to send");
  };

  const filteredCards = cards
    .filter((c) => c.type === activeTab)
    .filter((c) =>
      c.patientName.toLowerCase().includes(search.toLowerCase()) ||
      c.cardNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.patientId.toLowerCase().includes(search.toLowerCase())
    );

  const roomCount = cards.filter((c) => c.type === "room").length;
  const visitCount = cards.filter((c) => c.type === "visit").length;

  return (
    <div className="space-y-5">
      {/* Print overlay */}
      {printCard && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center print:static print:inset-auto">
          {printCard.type === "room"
            ? <PrintableRoomCard card={printCard} />
            : <PrintableVisitCard card={printCard} />
          }
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Patient Cards</h2>
          <p className="text-slate-500 text-sm">{roomCount} admitted · {visitCount} visit cards</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
          <Plus className="w-4 h-4" /> New Card
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        <button onClick={() => { setActiveTab("room"); setShowForm(false); }}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "room" ? "bg-[#1e3a5f] text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
          <BedDouble className="w-4 h-4" /> Room Cards ({roomCount})
        </button>
        <button onClick={() => { setActiveTab("visit"); setShowForm(false); }}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "visit" ? "bg-green-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
          <CalendarCheck className="w-4 h-4" /> Visit Cards ({visitCount})
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
          <h3 className="font-semibold text-slate-800">
            {activeTab === "room" ? "🛏 Issue Room Card (In-Patient Admission)" : "📋 Issue Visit Card (OPD / Follow-up)"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeTab === "room" ? (
              <>
                {[{ label: "Patient Name *", key: "patientName", placeholder: "Full name" },
                  { label: "Phone (WhatsApp)", key: "patientPhone", placeholder: "9876543210" },
                  { label: "Doctor Name *", key: "doctorName", placeholder: "Dr. Name" },
                  { label: "Room Number *", key: "roomNumber", placeholder: "101" },
                  { label: "Bed Number", key: "bedNumber", placeholder: "A (optional)" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
                    <input value={(roomForm as any)[f.key]} onChange={(e) => setRoomForm({ ...roomForm, [f.key]: e.target.value })} placeholder={f.placeholder}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Ward *</label>
                  <select value={roomForm.ward} onChange={(e) => setRoomForm({ ...roomForm, ward: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]">
                    {INPATIENT_WARDS.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Admission Date *</label>
                  <input type="date" value={roomForm.admissionDate} onChange={(e) => setRoomForm({ ...roomForm, admissionDate: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Diagnosis *</label>
                  <input value={roomForm.diagnosis} onChange={(e) => setRoomForm({ ...roomForm, diagnosis: e.target.value })} placeholder="Primary diagnosis"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
                </div>
              </>
            ) : (
              <>
                {[{ label: "Patient Name *", key: "patientName", placeholder: "Full name" },
                  { label: "Phone (WhatsApp)", key: "patientPhone", placeholder: "9876543210" },
                  { label: "Doctor Name *", key: "doctorName", placeholder: "Dr. Name" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
                    <input value={(visitForm as any)[f.key]} onChange={(e) => setVisitForm({ ...visitForm, [f.key]: e.target.value })} placeholder={f.placeholder}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Visit Date *</label>
                  <input type="date" value={visitForm.admissionDate} onChange={(e) => setVisitForm({ ...visitForm, admissionDate: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Purpose / Diagnosis *</label>
                  <input value={visitForm.diagnosis} onChange={(e) => setVisitForm({ ...visitForm, diagnosis: e.target.value })} placeholder="Reason for visit"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
                </div>
                <div className="sm:col-span-2 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
                  📋 Visit card expires in <strong>14 days</strong>. A <strong>token number</strong> will be automatically added to today's queue when this card is created.
                </div>
              </>
            )}
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className={`px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 ${activeTab === "room" ? "bg-[#1e3a5f] hover:bg-[#152d4a]" : "bg-green-600 hover:bg-green-700"}`}>
              {saving ? "Creating..." : `Create ${activeTab === "room" ? "Room" : "Visit"} Card`}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-5 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50">Cancel</button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${activeTab === "room" ? "room" : "visit"} cards...`}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
      </div>

      {/* Cards */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : filteredCards.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No active {activeTab === "room" ? "room" : "visit"} cards.
          <button onClick={() => setShowForm(true)} className="block mx-auto mt-3 text-[#1e3a5f] text-sm font-medium hover:underline">
            + Create one
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCards.map((card) => (
            <CardItem key={card.id} card={card}
              onPrint={() => handlePrint(card)}
              onDischarge={() => handleDischarge(card)}
              onWhatsApp={() => sendCardWhatsApp(card).then(() => toast.success("WhatsApp sent!"))}
              onReview={() => handleReview(card)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

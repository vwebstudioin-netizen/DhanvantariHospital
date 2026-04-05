"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Printer, IndianRupee } from "lucide-react";
import { createInvoice } from "@/lib/invoices";
import { SITE_NAME, HOSPITAL_ADDRESS, CONTACT_PHONE, INVOICE_PAYMENT_METHODS } from "@/lib/constants";
import type { InvoiceItem, InvoiceItemType, InvoicePaymentMethod } from "@/types/invoice";
import toast from "react-hot-toast";

const ITEM_TYPES: InvoiceItemType[] = ["consultation", "procedure", "medicine", "room", "lab", "other"];

const QUICK_ITEMS: { name: string; type: InvoiceItemType; price: number }[] = [
  { name: "Consultation Fee", type: "consultation", price: 500 },
  { name: "Follow-up Visit", type: "consultation", price: 300 },
  { name: "Blood Test", type: "lab", price: 250 },
  { name: "X-Ray", type: "lab", price: 400 },
  { name: "Room Charges (per day)", type: "room", price: 1000 },
  { name: "ICU Charges (per day)", type: "room", price: 3000 },
  { name: "Dressing", type: "procedure", price: 150 },
  { name: "IV Fluids", type: "medicine", price: 200 },
];

function InvoicePrint({ data }: { data: any }) {
  return (
    <div style={{ width: "210mm", padding: "20mm", fontFamily: "Arial", fontSize: "12px", color: "#1e293b" }}>
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #1e3a5f", paddingBottom: "12px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/images/logo.jpg" alt="Logo" style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }} />
          <div>
            <div style={{ fontSize: "18px", fontWeight: "900", color: "#1e3a5f", textTransform: "uppercase", letterSpacing: "1px" }}>{SITE_NAME}</div>
            <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>{HOSPITAL_ADDRESS}</div>
            <div style={{ fontSize: "10px", color: "#64748b" }}>Ph: {CONTACT_PHONE}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#1e3a5f" }}>INVOICE</div>
          <div style={{ fontSize: "11px", color: "#64748b" }}>{data.invoiceNumber}</div>
          <div style={{ fontSize: "11px", color: "#64748b" }}>{new Date().toLocaleDateString("en-IN")}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div>
          <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Bill To</div>
          <div style={{ fontWeight: "700", marginTop: "4px" }}>{data.patientName}</div>
          <div style={{ color: "#64748b" }}>{data.patientPhone}</div>
          {data.patientId && <div style={{ color: "#64748b", fontSize: "11px" }}>ID: {data.patientId}</div>}
        </div>
        {data.doctorName && (
          <div>
            <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Doctor</div>
            <div style={{ fontWeight: "700", marginTop: "4px" }}>{data.doctorName}</div>
          </div>
        )}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
        <thead>
          <tr style={{ background: "#1e3a5f", color: "#fff" }}>
            <th style={{ padding: "8px 12px", textAlign: "left", fontSize: "11px" }}>Description</th>
            <th style={{ padding: "8px 12px", textAlign: "center", fontSize: "11px" }}>Type</th>
            <th style={{ padding: "8px 12px", textAlign: "center", fontSize: "11px" }}>Qty</th>
            <th style={{ padding: "8px 12px", textAlign: "right", fontSize: "11px" }}>Rate</th>
            <th style={{ padding: "8px 12px", textAlign: "right", fontSize: "11px" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item: InvoiceItem, i: number) => (
            <tr key={i} style={{ borderBottom: "1px solid #e2e8f0", background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
              <td style={{ padding: "8px 12px" }}>{item.name}</td>
              <td style={{ padding: "8px 12px", textAlign: "center", color: "#64748b", textTransform: "capitalize" }}>{item.type}</td>
              <td style={{ padding: "8px 12px", textAlign: "center" }}>{item.quantity}</td>
              <td style={{ padding: "8px 12px", textAlign: "right" }}>₹{item.unitPrice.toFixed(2)}</td>
              <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "700" }}>₹{item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ width: "220px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#64748b" }}>
            <span>Subtotal</span><span>₹{data.subtotal.toFixed(2)}</span>
          </div>
          {data.discount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#16a34a" }}>
              <span>Discount</span><span>-₹{data.discount.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "2px solid #1e3a5f", fontWeight: "900", fontSize: "14px", color: "#1e3a5f" }}>
            <span>Total</span><span>₹{data.total.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: "11px", color: "#64748b" }}>
            <span>Payment</span><span style={{ textTransform: "capitalize" }}>{data.paymentMethod}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "24px", borderTop: "1px solid #e2e8f0", paddingTop: "12px", textAlign: "center", fontSize: "10px", color: "#94a3b8" }}>
        Thank you for choosing {SITE_NAME}. Wishing you a speedy recovery!
      </div>
    </div>
  );
}

export default function BillingPage() {
  const printRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<any>(null);

  const [patient, setPatient] = useState({ name: "", phone: "", patientId: "", doctorName: "" });
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<InvoicePaymentMethod>("cash");
  const [newItem, setNewItem] = useState({ name: "", type: "consultation" as InvoiceItemType, quantity: 1, unitPrice: 0 });

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const total = Math.max(0, subtotal - discount);

  const addItem = () => {
    if (!newItem.name || newItem.unitPrice <= 0) { toast.error("Enter item name and price"); return; }
    setItems([...items, { ...newItem, total: newItem.quantity * newItem.unitPrice }]);
    setNewItem({ name: "", type: "consultation", quantity: 1, unitPrice: 0 });
  };

  const addQuickItem = (qi: typeof QUICK_ITEMS[0]) => {
    setItems([...items, { name: qi.name, type: qi.type, quantity: 1, unitPrice: qi.price, total: qi.price }]);
  };

  const handleSave = async () => {
    if (!patient.name || !patient.phone || items.length === 0) {
      toast.error("Add patient details and at least one item");
      return;
    }
    setSaving(true);
    try {
      const { invoiceNumber } = await createInvoice({
        patientName: patient.name,
        patientPhone: patient.phone,
        patientId: patient.patientId || undefined,
        doctorName: patient.doctorName || undefined,
        items,
        subtotal,
        discount,
        discountType: "flat",
        tax: 0,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === "pending" ? "pending" : "paid",
        issuedBy: "Desk Staff",
      });
      setCreatedInvoice({ invoiceNumber, patientName: patient.name, patientPhone: patient.phone, patientId: patient.patientId, doctorName: patient.doctorName, items, subtotal, discount, total, paymentMethod });
      toast.success(`Invoice ${invoiceNumber} created!`);
    } catch {
      toast.error("Failed to create invoice");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const w = window.open("", "_blank", "width=800,height=600");
      if (w) {
        // Replace relative image paths with absolute URLs for the print window
        const html = printRef.current.innerHTML.replace(
          /src="\/images\//g,
          `src="${window.location.origin}/images/`
        );
        w.document.write(`<!DOCTYPE html><html><head><title>Invoice</title>
          <style>body{font-family:Arial,sans-serif;margin:0;padding:20px}@media print{body{padding:0}}</style>
          </head><body>${html}</body></html>`);
        w.document.close();
        w.focus();
        w.print();
        w.close();
      }
    }
  };

  if (createdInvoice) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <p className="font-bold text-slate-800">Invoice Created — {createdInvoice.invoiceNumber}</p>
            <p className="text-sm text-slate-500">Print or share with patient</p>
          </div>
        </div>
        <div ref={printRef} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <InvoicePrint data={createdInvoice} />
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
          {createdInvoice.patientPhone && (
            <button
              onClick={async () => {
                const res = await fetch("/api/whatsapp/send", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    phone: createdInvoice.patientPhone,
                    message: `Thank you for visiting Dhanvantari Hospital! We'd love your feedback ⭐\n\nRate your visit: ${window.location.origin}/reviews/submit?ref=${createdInvoice.invoiceNumber}&name=${encodeURIComponent(createdInvoice.patientName)}`,
                  }),
                });
                if (res.ok) toast.success("Review request sent via WhatsApp!");
                else toast.error("Failed to send WhatsApp");
              }}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
            >
              ⭐ Request Review via WhatsApp
            </button>
          )}
          <button onClick={() => { setCreatedInvoice(null); setPatient({ name: "", phone: "", patientId: "", doctorName: "" }); setItems([]); setDiscount(0); }} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50">
            New Invoice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-800">Create Invoice</h2>

      {/* Patient details */}
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h3 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wider">Patient Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: "name", label: "Patient Name *", placeholder: "Full name" },
            { key: "phone", label: "Phone *", placeholder: "9876543210" },
            { key: "patientId", label: "Patient ID", placeholder: "PAT-0001 (optional)" },
            { key: "doctorName", label: "Doctor Name", placeholder: "Dr. Name (optional)" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
              <input
                value={(patient as any)[f.key]}
                onChange={(e) => setPatient({ ...patient, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quick add items */}
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h3 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wider">Quick Add</h3>
        <div className="flex flex-wrap gap-2">
          {QUICK_ITEMS.map((qi) => (
            <button
              key={qi.name}
              onClick={() => addQuickItem(qi)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-[#1e3a5f] hover:text-white hover:border-[#1e3a5f] transition-colors"
            >
              {qi.name} — ₹{qi.price}
            </button>
          ))}
        </div>
      </div>

      {/* Add custom item */}
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h3 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wider">Add Item</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Item description"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
            />
          </div>
          <select
            value={newItem.type}
            onChange={(e) => setNewItem({ ...newItem, type: e.target.value as InvoiceItemType })}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
          >
            {ITEM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: +e.target.value })}
              min={1}
              placeholder="Qty"
              className="w-16 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
            />
            <input
              type="number"
              value={newItem.unitPrice || ""}
              onChange={(e) => setNewItem({ ...newItem, unitPrice: +e.target.value })}
              placeholder="Price"
              className="flex-1 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
            />
          </div>
        </div>
        <button onClick={addItem} className="mt-3 flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Items list */}
      {items.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Item</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rate</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-slate-50">
                  <td className="px-4 py-3">
                    <div>{item.name}</div>
                    <div className="text-xs text-slate-400 capitalize">{item.type}</div>
                  </td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">₹{item.unitPrice}</td>
                  <td className="px-4 py-3 text-right font-bold">₹{item.total}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setItems(items.filter((_, idx) => idx !== i))}>
                      <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-bold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Discount (₹)</span>
              <input
                type="number"
                value={discount || ""}
                onChange={(e) => setDiscount(+e.target.value)}
                min={0}
                placeholder="0"
                className="w-24 border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
              />
            </div>
            <div className="flex items-center justify-between text-base font-bold text-[#1e3a5f] border-t border-slate-200 pt-3">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Payment</span>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as InvoicePaymentMethod)}
                className="border border-slate-200 rounded-lg px-2 py-1 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
              >
                {INVOICE_PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving || items.length === 0}
        className="w-full sm:w-auto bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#152d4a] transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : "Generate Invoice"}
      </button>
    </div>
  );
}

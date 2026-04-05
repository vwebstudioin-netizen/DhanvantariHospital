"use client";

import { useState } from "react";
import { Search, Printer } from "lucide-react";
import { format } from "date-fns";
import { SITE_NAME, CONTACT_PHONE, HOSPITAL_ADDRESS } from "@/lib/constants";

// Sample data — in production fetches from Firestore
const SAMPLE_INVOICES = [
  { id: "1", invoiceNumber: "INV-0001", patientName: "Ravi Kumar", patientPhone: "9876543210", doctorName: "Dr. Smith", items: [{ name: "Consultation Fee", type: "consultation", quantity: 1, unitPrice: 500, total: 500 }, { name: "Blood Test", type: "lab", quantity: 1, unitPrice: 250, total: 250 }], subtotal: 750, discount: 0, total: 750, paymentMethod: "cash", paymentStatus: "paid", createdAt: "2026-03-26" },
  { id: "2", invoiceNumber: "INV-0002", patientName: "Priya Patel", patientPhone: "9876543211", doctorName: "Dr. Jones", items: [{ name: "Room Charges", type: "room", quantity: 3, unitPrice: 1000, total: 3000 }, { name: "IV Fluids", type: "medicine", quantity: 2, unitPrice: 200, total: 400 }], subtotal: 3400, discount: 200, total: 3200, paymentMethod: "upi", paymentStatus: "paid", createdAt: "2026-03-25" },
];

export default function BillsPage() {
  const [search, setSearch] = useState("");
  const [printInvoice, setPrintInvoice] = useState<typeof SAMPLE_INVOICES[0] | null>(null);

  const filtered = SAMPLE_INVOICES.filter(
    (inv) =>
      inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.patientPhone.includes(search)
  );

  const handlePrint = (inv: typeof SAMPLE_INVOICES[0]) => {
    setPrintInvoice(inv);
    setTimeout(() => {
      window.print();
      setPrintInvoice(null);
    }, 200);
  };

  return (
    <div className="space-y-5">
      {printInvoice && (
        <div className="fixed inset-0 bg-white z-50 p-8 print:static">
          <div style={{ fontFamily: "Arial", fontSize: "12px", color: "#1e293b" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #1e3a5f", paddingBottom: "12px", marginBottom: "16px" }}>
              <div>
                <div style={{ fontSize: "20px", fontWeight: "900", color: "#1e3a5f" }}>{SITE_NAME}</div>
                <div style={{ fontSize: "10px", color: "#64748b" }}>{HOSPITAL_ADDRESS} · {CONTACT_PHONE}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#1e3a5f" }}>INVOICE</div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>{printInvoice.invoiceNumber}</div>
              </div>
            </div>
            <div style={{ marginBottom: "12px" }}>
              <strong>{printInvoice.patientName}</strong> · {printInvoice.patientPhone}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "#1e3a5f", color: "#fff" }}>
                <th style={{ padding: "6px 10px", textAlign: "left" }}>Item</th>
                <th style={{ padding: "6px 10px", textAlign: "right" }}>Amount</th>
              </tr></thead>
              <tbody>{printInvoice.items.map((item, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "6px 10px" }}>{item.name} × {item.quantity}</td>
                  <td style={{ padding: "6px 10px", textAlign: "right" }}>₹{item.total}</td>
                </tr>
              ))}</tbody>
            </table>
            <div style={{ textAlign: "right", marginTop: "8px" }}>
              {printInvoice.discount > 0 && <div style={{ color: "#16a34a" }}>Discount: -₹{printInvoice.discount}</div>}
              <div style={{ fontWeight: "900", fontSize: "16px", color: "#1e3a5f" }}>Total: ₹{printInvoice.total}</div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-slate-800">Invoice History</h2>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, invoice number or phone..."
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-4 py-3 font-mono font-bold text-[#1e3a5f]">{inv.invoiceNumber}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{inv.patientName}</div>
                  <div className="text-xs text-slate-400">{inv.patientPhone}</div>
                </td>
                <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{inv.createdAt}</td>
                <td className="px-4 py-3 text-right font-bold">₹{inv.total}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    inv.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {inv.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handlePrint(inv)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-400">No invoices found.</div>
        )}
      </div>
    </div>
  );
}

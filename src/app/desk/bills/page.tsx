"use client";

import { useState, useEffect } from "react";
import { Search, Printer, RefreshCw } from "lucide-react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SITE_NAME, CONTACT_PHONE, HOSPITAL_ADDRESS } from "@/lib/constants";
import toast from "react-hot-toast";

interface InvoiceItem {
  name: string; type: string; quantity: number; unitPrice: number; total: number;
}
interface Invoice {
  id: string; invoiceNumber: string; patientName: string; patientPhone: string;
  doctorName?: string; items: InvoiceItem[]; subtotal: number; discount: number;
  total: number; paymentMethod: string; paymentStatus: string; createdAt: any;
}

export default function BillsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const q = query(collection(db, "invoices"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setInvoices(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Invoice[]);
    } catch {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }

  const filtered = invoices.filter(
    (inv) =>
      inv.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      inv.patientPhone?.includes(search)
  );

  const handlePrint = (inv: Invoice) => {
    // Use inv directly — no stale closure risk
    const w = window.open("", "_blank", "width=800,height=600");
    if (w) {
      w.document.write(`<!DOCTYPE html><html><head><title>Invoice ${inv.invoiceNumber}</title>
        <style>body{font-family:Arial,sans-serif;margin:0;padding:20px}table{width:100%;border-collapse:collapse}th,td{padding:6px 10px;text-align:left;border-bottom:1px solid #e2e8f0}thead tr{background:#1e3a5f;color:#fff}</style>
        </head><body>${buildPrintHTML(inv)}</body></html>`);
      w.document.close(); w.focus(); w.print(); w.close();
    }
  };

  function buildPrintHTML(inv: Invoice) {
    return `
      <div style="display:flex;justify-content:space-between;border-bottom:2px solid #1e3a5f;padding-bottom:12px;margin-bottom:16px;align-items:center">
        <div style="display:flex;align-items:center;gap:10px">
          <img src="${window.location.origin}/images/logo.jpg" style="width:44px;height:44px;border-radius:50%;object-fit:cover" />
          <div>
            <div style="font-size:18px;font-weight:900;color:#1e3a5f">${SITE_NAME}</div>
            <div style="font-size:10px;color:#64748b">${HOSPITAL_ADDRESS} · ${CONTACT_PHONE}</div>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:16px;font-weight:700;color:#1e3a5f">INVOICE</div>
          <div style="font-size:11px;color:#64748b">${inv.invoiceNumber}</div>
          <div style="font-size:11px;color:#64748b">${inv.createdAt?.toDate?.()?.toLocaleDateString("en-IN") || new Date().toLocaleDateString("en-IN")}</div>
        </div>
      </div>
      <div style="margin-bottom:12px"><strong>${inv.patientName}</strong> · ${inv.patientPhone}${inv.doctorName ? ` · ${inv.doctorName}` : ""}</div>
      <table>
        <thead><tr><th>Item</th><th>Type</th><th>Qty</th><th>Rate</th><th>Total</th></tr></thead>
        <tbody>
          ${inv.items?.map((item) => `<tr><td>${item.name}</td><td>${item.type}</td><td>${item.quantity}</td><td>₹${item.unitPrice}</td><td>₹${item.total}</td></tr>`).join("") || ""}
        </tbody>
      </table>
      <div style="text-align:right;margin-top:8px">
        ${inv.discount > 0 ? `<div style="color:#16a34a">Discount: -₹${inv.discount}</div>` : ""}
        <div style="font-size:16px;font-weight:900;color:#1e3a5f;margin-top:4px">Total: ₹${inv.total}</div>
        <div style="font-size:11px;color:#64748b;text-transform:capitalize">${inv.paymentMethod}</div>
      </div>
      <div style="margin-top:20px;border-top:1px solid #e2e8f0;padding-top:10px;text-align:center;font-size:10px;color:#94a3b8">
        Thank you for choosing ${SITE_NAME}. Wishing you a speedy recovery!
      </div>`;
  }

  const statusColor = (s: string) =>
    s === "paid" ? "bg-green-100 text-green-700" :
    s === "pending" ? "bg-amber-100 text-amber-700" :
    "bg-gray-100 text-gray-600";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Invoice History</h2>
        <button onClick={load} className="p-2 text-slate-400 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, invoice number or phone..."
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading invoices...</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400">
                  {search ? "No invoices match your search." : "No invoices yet. Create one from New Invoice."}
                </td></tr>
              ) : filtered.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-mono font-bold text-[#1e3a5f]">{inv.invoiceNumber}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-800">{inv.patientName}</div>
                    <div className="text-xs text-slate-400">{inv.patientPhone}</div>
                  </td>
                  <td className="px-5 py-3 text-slate-500 hidden sm:table-cell text-xs">
                    {inv.createdAt?.toDate?.()?.toLocaleDateString("en-IN") || "—"}
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-slate-800">₹{inv.total}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${statusColor(inv.paymentStatus)}`}>
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => handlePrint(inv)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                      <Printer className="w-3.5 h-3.5" /> Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

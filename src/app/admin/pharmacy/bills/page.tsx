"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, Printer, RefreshCw, IndianRupee } from "lucide-react";
import { SITE_NAME, HOSPITAL_ADDRESS, CONTACT_PHONE } from "@/lib/constants";
import toast from "react-hot-toast";

interface PharmacyBill {
  id: string;
  billNumber: string;
  patientName: string;
  patientPhone: string;
  doctorName?: string;
  items: { name: string; unit: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: any;
}

function buildPrintHTML(bill: PharmacyBill) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:210mm;margin:0 auto;padding:20mm;font-size:12px">
      <div style="display:flex;justify-content:space-between;border-bottom:2px solid #1e3a5f;padding-bottom:12px;margin-bottom:16px;align-items:center">
        <div style="display:flex;align-items:center;gap:10px">
          <img src="${window.location.origin}/images/logo.jpg" style="width:44px;height:44px;border-radius:50%;object-fit:cover"/>
          <div>
            <div style="font-size:18px;font-weight:900;color:#1e3a5f">${SITE_NAME}</div>
            <div style="font-size:10px;color:#64748b">${HOSPITAL_ADDRESS} · ${CONTACT_PHONE}</div>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:16px;font-weight:700;color:#1e3a5f">PHARMACY BILL</div>
          <div style="font-size:11px;color:#64748b">${bill.billNumber}</div>
          <div style="font-size:11px;color:#64748b">${bill.createdAt?.toDate?.()?.toLocaleDateString("en-IN") || ""}</div>
        </div>
      </div>
      <div style="margin-bottom:12px">
        <strong>${bill.patientName}</strong> · ${bill.patientPhone}
        ${bill.doctorName ? ` · Prescribed by: ${bill.doctorName}` : ""}
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px">
        <thead><tr style="background:#1e3a5f;color:#fff">
          <th style="padding:7px 10px;text-align:left">Medicine</th>
          <th style="padding:7px 10px;text-align:center">Qty</th>
          <th style="padding:7px 10px;text-align:right">Rate</th>
          <th style="padding:7px 10px;text-align:right">Amount</th>
        </tr></thead>
        <tbody>
          ${bill.items.map((item, i) => `
            <tr style="background:${i % 2 === 0 ? "#fff" : "#f8fafc"}">
              <td style="padding:7px 10px">${item.name}</td>
              <td style="padding:7px 10px;text-align:center">${item.quantity} ${item.unit}</td>
              <td style="padding:7px 10px;text-align:right">₹${item.unitPrice.toFixed(2)}</td>
              <td style="padding:7px 10px;text-align:right;font-weight:600">₹${item.total.toFixed(2)}</td>
            </tr>`).join("")}
        </tbody>
      </table>
      <div style="text-align:right">
        ${bill.discount > 0 ? `<div style="color:#16a34a;margin-bottom:4px">Discount: -₹${bill.discount.toFixed(2)}</div>` : ""}
        <div style="font-size:16px;font-weight:900;color:#1e3a5f">Total: ₹${bill.total.toFixed(2)}</div>
        <div style="font-size:11px;color:#64748b;text-transform:capitalize;margin-top:2px">${bill.paymentMethod}</div>
      </div>
      <div style="margin-top:20px;border-top:1px solid #e2e8f0;padding-top:10px;text-align:center;font-size:10px;color:#94a3b8">
        Thank you for choosing ${SITE_NAME} Pharmacy. Get well soon!
      </div>
    </div>`;
}

export default function PharmacyBillsPage() {
  const [bills, setBills] = useState<PharmacyBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const q = query(collection(db, "pharmacyBills"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setBills(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PharmacyBill[]);
    } catch { toast.error("Failed to load bills"); }
    finally { setLoading(false); }
  }

  const filtered = bills.filter((b) =>
    b.patientName?.toLowerCase().includes(search.toLowerCase()) ||
    b.billNumber?.toLowerCase().includes(search.toLowerCase()) ||
    b.patientPhone?.includes(search)
  );

  const handlePrint = (bill: PharmacyBill) => {
    const w = window.open("", "_blank", "width=900,height=700");
    if (w) {
      w.document.write(`<!DOCTYPE html><html><head><title>Pharmacy Bill ${bill.billNumber}</title>
        <style>body{margin:0}@media print{body{margin:0}}</style>
        </head><body>${buildPrintHTML(bill)}</body></html>`);
      w.document.close(); w.focus(); w.print(); w.close();
    }
  };

  const todayTotal = bills
    .filter((b) => {
      const d = b.createdAt?.toDate?.();
      return d && d.toDateString() === new Date().toDateString();
    })
    .reduce((s, b) => s + b.total, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pharmacy Bills</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {bills.length} total · Today: ₹{todayTotal.toFixed(2)}
          </p>
        </div>
        <button onClick={load} className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name, phone or bill number..."
          className="w-full pl-9 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading bills...</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bill No.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Items</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">
                  {search ? "No bills match your search." : "No pharmacy bills yet."}
                </td></tr>
              ) : filtered.map((bill) => (
                <tr key={bill.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono font-bold text-primary">{bill.billNumber}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{bill.patientName}</div>
                    <div className="text-xs text-muted-foreground">{bill.patientPhone}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                    {bill.items?.length || 0} medicine{bill.items?.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                    {bill.createdAt?.toDate?.()?.toLocaleDateString("en-IN") || "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">₹{bill.total?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
                      bill.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {bill.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handlePrint(bill)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted">
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

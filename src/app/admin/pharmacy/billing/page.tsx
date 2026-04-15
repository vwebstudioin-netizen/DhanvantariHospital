"use client";

import { useState, useEffect } from "react";
import { usePatientLookup } from "@/hooks/usePatientLookup";
import { getMedicines } from "@/lib/medicines";
import { dispense } from "@/lib/stock";
import { collection, addDoc, getDocs, query, orderBy, Timestamp, runTransaction, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SITE_NAME, HOSPITAL_ADDRESS, CONTACT_PHONE } from "@/lib/constants";
import { Plus, Trash2, Printer, Search, IndianRupee, MessageCircle } from "lucide-react";
import { buildPharmacyBillLink } from "@/lib/whatsapp";
import type { Medicine } from "@/types/medicine";
import toast from "react-hot-toast";

interface CartItem {
  medicineId: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
  currentStock: number;
}

const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Insurance", "Pending"] as const;

async function getNextBillNumber(): Promise<string> {
  const counterRef = doc(db, "counters", "pharmacyBills");
  let num = 1;
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    if (snap.exists()) {
      num = (snap.data().lastNumber || 0) + 1;
      tx.update(counterRef, { lastNumber: num });
    } else {
      tx.set(counterRef, { lastNumber: 1 });
    }
  });
  return `PHRM-${String(num).padStart(4, "0")}`;
}

function buildPrintHTML(bill: any) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:210mm;margin:0 auto;padding:20mm;font-size:12px">
      <div style="display:flex;justify-content:space-between;border-bottom:2px solid #1e3a5f;padding-bottom:12px;margin-bottom:16px;align-items:center">
        <div style="display:flex;align-items:center;gap:10px">
          <img src="${typeof window !== "undefined" ? window.location.origin : ""}/images/logo.jpg" style="width:44px;height:44px;border-radius:50%;object-fit:cover"/>
          <div>
            <div style="font-size:18px;font-weight:900;color:#1e3a5f">${SITE_NAME}</div>
            <div style="font-size:10px;color:#64748b">${HOSPITAL_ADDRESS}</div>
            <div style="font-size:10px;color:#64748b">Ph: ${CONTACT_PHONE}</div>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:16px;font-weight:700;color:#1e3a5f">PHARMACY BILL</div>
          <div style="font-size:11px;color:#64748b">${bill.billNumber}</div>
          <div style="font-size:11px;color:#64748b">${new Date().toLocaleDateString("en-IN")}</div>
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
          ${bill.items.map((item: CartItem, i: number) => `
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

export default function PharmacyBillingPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [patient, setPatient] = useState({ name: "", phone: "", doctorName: "" });
  const { match: patientMatch, loading: lookingUp } = usePatientLookup(patient.phone);
  useEffect(() => {
    if (!patientMatch) return;
    setPatient(prev => ({
      ...prev,
      name: prev.name || patientMatch.name,
      phone: prev.phone || patientMatch.phone,
    }));
  }, [patientMatch]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<typeof PAYMENT_METHODS[number]>("Cash");
  const [saving, setSaving] = useState(false);
  const [createdBill, setCreatedBill] = useState<any>(null);

  useEffect(() => {
    getMedicines(true).then(setMedicines).catch(() => toast.error("Failed to load medicines"));
  }, []);

  const subtotal = cart.reduce((s, i) => s + i.total, 0);
  const total = Math.max(0, subtotal - discount);

  const addToCart = (med: Medicine) => {
    const existing = cart.find((c) => c.medicineId === med.id);
    if (existing) {
      if (existing.quantity >= med.currentStock) {
        toast.error(`Only ${med.currentStock} ${med.unit}s in stock`);
        return;
      }
      setCart(cart.map((c) => c.medicineId === med.id
        ? { ...c, quantity: c.quantity + 1, total: (c.quantity + 1) * c.unitPrice }
        : c));
    } else {
      if (med.currentStock < 1) { toast.error("Out of stock"); return; }
      setCart([...cart, {
        medicineId: med.id, name: med.name, unit: med.unit,
        quantity: 1, unitPrice: med.sellingPrice, total: med.sellingPrice,
        currentStock: med.currentStock,
      }]);
    }
    setSearch("");
  };

  const updateQty = (id: string, qty: number) => {
    const item = cart.find((c) => c.medicineId === id)!;
    if (qty > item.currentStock) { toast.error(`Only ${item.currentStock} available`); return; }
    if (qty < 1) { setCart(cart.filter((c) => c.medicineId !== id)); return; }
    setCart(cart.map((c) => c.medicineId === id ? { ...c, quantity: qty, total: qty * c.unitPrice } : c));
  };

  const handleSave = async () => {
    if (!patient.name || !patient.phone) { toast.error("Patient name and phone required"); return; }
    if (cart.length === 0) { toast.error("Add at least one medicine"); return; }
    setSaving(true);
    try {
      const billNumber = await getNextBillNumber();

      // Deduct stock for each medicine
      for (const item of cart) {
        await dispense(item.medicineId, item.quantity, "Pharmacist",
          { name: patient.name, phone: patient.phone });
      }

      // Save pharmacy bill
      await addDoc(collection(db, "pharmacyBills"), {
        billNumber,
        patientName: patient.name,
        patientPhone: patient.phone,
        doctorName: patient.doctorName || null,
        items: cart.map(({ medicineId, name, unit, quantity, unitPrice, total }) =>
          ({ medicineId, name, unit, quantity, unitPrice, total })),
        subtotal,
        discount,
        total,
        paymentMethod: paymentMethod.toLowerCase(),
        paymentStatus: paymentMethod === "Pending" ? "pending" : "paid",
        issuedBy: "Pharmacist",
        createdAt: Timestamp.now(),
      });

      setCreatedBill({ billNumber, ...patient, items: cart, subtotal, discount, total, paymentMethod });
      toast.success(`Bill ${billNumber} created & stock updated!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create bill");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = (bill: any) => {
    const w = window.open("", "_blank", "width=900,height=700");
    if (w) {
      w.document.write(`<!DOCTYPE html><html><head><title>Pharmacy Bill ${bill.billNumber}</title>
        <style>body{margin:0}@media print{body{margin:0}}</style>
        </head><body>${buildPrintHTML(bill)}</body></html>`);
      w.document.close(); w.focus(); w.print(); w.close();
    }
  };

  const filteredMeds = search.length > 1
    ? medicines.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.genericName.toLowerCase().includes(search.toLowerCase()))
    : [];

  if (createdBill) {
    return (
      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <p className="font-bold text-foreground">Bill Created — {createdBill.billNumber}</p>
            <p className="text-sm text-muted-foreground">Stock deducted from inventory</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-semibold">{createdBill.name}</p>
              <p className="text-sm text-muted-foreground">{createdBill.phone}</p>
            </div>
            <p className="text-xl font-black text-primary">₹{createdBill.total.toFixed(2)}</p>
          </div>
          <table className="w-full text-sm mb-4">
            <thead className="bg-muted"><tr>
              <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Medicine</th>
              <th className="text-center px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Qty</th>
              <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
            </tr></thead>
            <tbody>
              {createdBill.items.map((item: CartItem) => (
                <tr key={item.medicineId} className="border-b border-border/50">
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2 text-center">{item.quantity} {item.unit}</td>
                  <td className="px-3 py-2 text-right font-medium">₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => handlePrint(createdBill)}
            className="flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
            <Printer className="w-4 h-4" /> Print Bill
          </button>
          {createdBill.phone && (
            <a
            href={buildPharmacyBillLink(
                createdBill.phone,
                createdBill.name,
                createdBill.billNumber,
                createdBill.total,
                createdBill.items
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1ebe5d]"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          )}
          <button onClick={() => { setCreatedBill(null); setCart([]); setPatient({ name: "", phone: "", doctorName: "" }); setDiscount(0); }}
            className="px-5 py-2 rounded-lg text-sm font-medium text-muted-foreground border border-border hover:bg-muted">
            New Bill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground">Pharmacy Bill</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Medicine search + cart */}
        <div className="lg:col-span-2 space-y-4">
          {/* Medicine search */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Add Medicines</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search medicine by name or generic..."
                className="w-full pl-9 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            {filteredMeds.length > 0 && (
              <div className="mt-2 border border-border rounded-lg overflow-hidden divide-y divide-border">
                {filteredMeds.slice(0, 6).map((med) => (
                  <button key={med.id} onClick={() => addToCart(med)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-muted text-left">
                    <div>
                      <span className="font-medium">{med.name}</span>
                      <span className="text-muted-foreground text-xs ml-2">{med.genericName}</span>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <span className="font-bold text-primary">₹{med.sellingPrice}</span>
                      <span className={`text-xs ml-2 ${med.currentStock <= med.reorderLevel ? "text-red-500" : "text-muted-foreground"}`}>
                        {med.currentStock} {med.unit}s
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {search.length > 1 && filteredMeds.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">No medicines found.</p>
            )}
          </div>

          {/* Cart */}
          {cart.length > 0 && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Medicine</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Qty</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rate</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.medicineId} className="border-b border-border/50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.unit}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => updateQty(item.medicineId, item.quantity - 1)}
                            className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-muted text-sm font-bold">−</button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button onClick={() => updateQty(item.medicineId, item.quantity + 1)}
                            className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-muted text-sm font-bold">+</button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">₹{item.unitPrice}</td>
                      <td className="px-4 py-3 text-right font-bold">₹{item.total.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => setCart(cart.filter((c) => c.medicineId !== item.medicineId))}
                          className="text-muted-foreground hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Patient + billing summary */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Patient Details</h3>
            {[
              { label: "Name *", key: "name", placeholder: "Patient name" },
              { label: "Phone *", key: "phone", placeholder: "9876543210" },
              { label: "Doctor (optional)", key: "doctorName", placeholder: "Prescribing doctor" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                <input value={(patient as any)[f.key]} onChange={(e) => setPatient({ ...patient, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            ))}
            {lookingUp && patient.phone.replace(/\D/g,"").length === 10 && (
              <p className="text-xs text-muted-foreground mt-1">Searching patient records…</p>
            )}
            {patientMatch && (
              <p className="text-xs text-green-600 mt-1 font-medium">✓ Patient found: {patientMatch.name}{patientMatch.bloodGroup ? ` · ${patientMatch.bloodGroup}` : ""}</p>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Payment</h3>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Discount (₹)</label>
              <input type="number" min={0} value={discount || ""}
                onChange={(e) => setDiscount(Math.min(+e.target.value, subtotal))}
                placeholder="0"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Payment Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="border-t border-border pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span><span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-foreground text-base pt-1 border-t border-border">
                <span>Total</span><span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handleSave} disabled={saving || cart.length === 0}
              className="w-full bg-[#1e3a5f] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-50">
              {saving ? "Creating Bill..." : "Generate Bill"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

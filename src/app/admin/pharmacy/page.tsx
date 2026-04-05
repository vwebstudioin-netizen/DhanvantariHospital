"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Pill, AlertTriangle, TrendingDown, ArrowDownUp, CheckCircle, Receipt, FileText, Truck, BarChart3 } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
  expiryDate?: string;
}

export default function PharmacyDashboard() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, "medicines"));
        setMedicines(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Medicine[]);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const total = medicines.length;
  const lowStock = medicines.filter((m) => m.currentStock > 0 && m.currentStock <= m.reorderLevel);
  const outOfStock = medicines.filter((m) => m.currentStock === 0);
  const inStock = medicines.filter((m) => m.currentStock > m.reorderLevel);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pharmacy</h1>
        <p className="text-muted-foreground text-sm mt-1">Medicine inventory &amp; stock management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Medicines", value: loading ? "…" : total,            icon: Pill,         cls: "bg-blue-50 text-blue-600" },
          { label: "Low Stock",       value: loading ? "…" : lowStock.length,  icon: AlertTriangle, cls: "bg-red-50 text-red-600" },
          { label: "In Stock",        value: loading ? "…" : inStock.length,   icon: CheckCircle,  cls: "bg-green-50 text-green-600" },
          { label: "Out of Stock",    value: loading ? "…" : outOfStock.length, icon: TrendingDown, cls: "bg-amber-50 text-amber-600" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${s.cls} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Stock Alert Table */}
      {!loading && lowStock.length > 0 && (
        <div className="bg-card border border-red-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-red-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h2 className="font-semibold text-red-700">Low Stock Alerts</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-red-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-red-600 uppercase tracking-wider">Medicine</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-red-600 uppercase tracking-wider">Stock</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-red-600 uppercase tracking-wider hidden sm:table-cell">Reorder At</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((m) => (
                <tr key={m.id} className="border-b border-red-50">
                  <td className="px-5 py-3">
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.genericName}</div>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-red-600">{m.currentStock}</td>
                  <td className="px-5 py-3 text-right text-muted-foreground hidden sm:table-cell">{m.reorderLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Out of Stock */}
      {!loading && outOfStock.length > 0 && (
        <div className="bg-card border border-amber-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-amber-100 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-amber-500" />
            <h2 className="font-semibold text-amber-700">Out of Stock</h2>
          </div>
          <div className="divide-y divide-amber-50">
            {outOfStock.map((m) => (
              <div key={m.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.category}</p>
                </div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">0 {m.unit}s</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Navigation */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { href: "/admin/pharmacy/medicines",  label: "Medicines",    icon: Pill,         desc: "Catalog & pricing" },
            { href: "/admin/pharmacy/stock",       label: "Stock",        icon: ArrowDownUp,  desc: "In/out movements" },
            { href: "/admin/pharmacy/billing",     label: "New Invoice",  icon: Receipt,      desc: "Sell medicines" },
            { href: "/admin/pharmacy/bills",       label: "Invoice Hist.", icon: FileText,     desc: "Past invoices" },
            { href: "/admin/pharmacy/suppliers",   label: "Suppliers",    icon: Truck,        desc: "Supplier list" },
            { href: "/admin/pharmacy/reports",     label: "Reports",      icon: BarChart3,    desc: "Expiry & stock" },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-sm transition-all group flex flex-col items-center text-center gap-2"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-primary text-sm">{link.label}</p>
                  <p className="text-xs text-muted-foreground">{link.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

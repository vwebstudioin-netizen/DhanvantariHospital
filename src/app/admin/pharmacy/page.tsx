"use client";

import Link from "next/link";
import { Pill, AlertTriangle, TrendingDown, ArrowDownUp, CheckCircle } from "lucide-react";

const SAMPLE_LOW_STOCK = [
  { id: "1", name: "Paracetamol 500mg", genericName: "Paracetamol", category: "Analgesics", currentStock: 5, reorderLevel: 20, unit: "tablet" },
  { id: "2", name: "Amoxicillin 250mg", genericName: "Amoxicillin", category: "Antibiotics", currentStock: 8, reorderLevel: 30, unit: "capsule" },
];

export default function PharmacyDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pharmacy</h1>
        <p className="text-muted-foreground text-sm mt-1">Medicine inventory & stock management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Medicines", value: "—", icon: Pill, cls: "bg-blue-50 text-blue-600" },
          { label: "Low Stock", value: SAMPLE_LOW_STOCK.length, icon: AlertTriangle, cls: "bg-red-50 text-red-600" },
          { label: "In Stock", value: "—", icon: CheckCircle, cls: "bg-green-50 text-green-600" },
          { label: "Out of Stock", value: "—", icon: TrendingDown, cls: "bg-amber-50 text-amber-600" },
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

      {SAMPLE_LOW_STOCK.length > 0 && (
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
              {SAMPLE_LOW_STOCK.map((m) => (
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: "/admin/pharmacy/medicines", label: "Medicines", icon: Pill, desc: "Catalog & pricing" },
          { href: "/admin/pharmacy/stock", label: "Stock", icon: ArrowDownUp, desc: "In/out movements" },
          { href: "/admin/pharmacy/suppliers", label: "Suppliers", icon: CheckCircle, desc: "Supplier list" },
          { href: "/admin/pharmacy/reports", label: "Reports", icon: TrendingDown, desc: "Expiry & stock" },
        ].map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-sm transition-all group flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
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
  );
}

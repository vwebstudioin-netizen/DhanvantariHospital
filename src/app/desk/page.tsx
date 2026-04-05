"use client";

import Link from "next/link";
import { CreditCard, Receipt, FileText, Gift, Users } from "lucide-react";

const QUICK_ACTIONS = [
  {
    label: "New In-Patient Card",
    desc: "Issue a 14-day patient card",
    href: "/desk/inpatient-card",
    icon: CreditCard,
    color: "bg-blue-50 text-blue-700",
  },
  {
    label: "Create Invoice",
    desc: "Bill consultation or services",
    href: "/desk/billing",
    icon: Receipt,
    color: "bg-green-50 text-green-700",
  },
  {
    label: "Invoice History",
    desc: "View and print past bills",
    href: "/desk/bills",
    icon: FileText,
    color: "bg-purple-50 text-purple-700",
  },
  {
    label: "Festive Wishes",
    desc: "Send wishes to all patients",
    href: "/desk/wishes",
    icon: Gift,
    color: "bg-amber-50 text-amber-700",
  },
];

export default function DeskDashboard() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Welcome</h2>
        <p className="text-slate-500 text-sm mt-0.5">{today}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white rounded-xl border border-slate-100 p-5 flex items-start gap-4 hover:border-[#1e3a5f]/30 hover:shadow-sm transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 group-hover:text-[#1e3a5f] transition-colors">
                  {action.label}
                </p>
                <p className="text-sm text-slate-500 mt-0.5">{action.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-[#1e3a5f] text-white rounded-xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-5 h-5 text-white/70" />
          <p className="font-semibold">Quick Note</p>
        </div>
        <p className="text-sm text-white/70">
          In-patient cards automatically expire after 14 days. Patients can receive their card details via WhatsApp after issuance.
        </p>
      </div>
    </div>
  );
}

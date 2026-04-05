"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthContext } from "@/providers/AuthProvider";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { SITE_NAME } from "@/lib/constants";
import Link from "next/link";
import {
  LayoutDashboard, CreditCard, Receipt, FileText, Gift,
  Ticket, LogOut, Menu, X, Hospital,
} from "lucide-react";
import { useState } from "react";

// All receptionist links stay within /desk/* — no cross-layout navigation
const RECEPTIONIST_LINKS = [
  { href: "/desk",                label: "Dashboard",        icon: LayoutDashboard },
  { href: "/desk/queue",          label: "Token Queue",      icon: Ticket },
  { href: "/desk/inpatient-card", label: "In-Patient Cards", icon: CreditCard },
  { href: "/desk/billing",        label: "New Invoice",      icon: Receipt },
  { href: "/desk/bills",          label: "Invoice History",  icon: FileText },
  { href: "/desk/wishes",         label: "Festive Wishes",   icon: Gift },
];

const PHARMACIST_LINKS = [
  { href: "/desk/billing", label: "New Invoice",     icon: Receipt },
  { href: "/desk/bills",   label: "Invoice History", icon: FileText },
];

const PHARMACIST_DESK_ALLOWED = ["/desk/billing", "/desk/bills"];

export default function DeskLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Use the shared AuthContext — same source of truth as the admin layout
  const { user, loading, isAdmin, isReceptionist, isPharmacist } = useAuthContext();

  // Handle access control — redirect if unauthorized
  useEffect(() => {
    if (loading) return;
    if (pathname === "/desk/login") return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!isAdmin && !isReceptionist && !isPharmacist) {
      router.push("/login");
      return;
    }

    // Pharmacist can only access billing pages on /desk
    if (isPharmacist && !isAdmin && !PHARMACIST_DESK_ALLOWED.some((p) => pathname.startsWith(p))) {
      router.push("/desk/billing");
    }
  }, [user, loading, isAdmin, isReceptionist, isPharmacist, pathname, router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (pathname === "/desk/login") return <>{children}</>;

  if (loading || (!isAdmin && !isReceptionist && !isPharmacist)) {
    return (
      <div className="min-h-screen bg-[#0f1729] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const sidebarLinks = (isPharmacist && !isAdmin) ? PHARMACIST_LINKS : RECEPTIONIST_LINKS;
  const roleLabel = isPharmacist && !isAdmin ? "Pharmacy" : isAdmin ? "Admin" : "Reception";

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-[#0f1729] flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-4 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Hospital className="w-4 h-4 text-white/50" />
            <div>
              <p className="text-sm font-bold text-white">{SITE_NAME}</p>
              <p className="text-[10px] text-white/40">{roleLabel} Desk</p>
            </div>
          </div>
        </div>

        {user?.email && (
          <div className="px-4 py-2 border-b border-white/5">
            <p className="text-xs text-white/40 truncate">{user.email}</p>
          </div>
        )}

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                <link.icon className="w-4 h-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-white/5">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 lg:ml-56">
        <header className="bg-white border-b border-neutral-200 px-5 py-3 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-neutral-600 p-1">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-sm font-semibold text-neutral-700">
            {sidebarLinks.find((l) => pathname === l.href)?.label ?? "Desk"}
          </h1>
        </header>
        <main className="p-5">{children}</main>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserRole, type UserRole } from "@/lib/userRoles";
import { SITE_NAME } from "@/lib/constants";
import Link from "next/link";
import {
  LayoutDashboard, CreditCard, Receipt, FileText, Gift,
  Ticket, LogOut, Menu, X, Hospital,
} from "lucide-react";

const RECEPTIONIST_LINKS = [
  { href: "/desk",                label: "Dashboard",        icon: LayoutDashboard },
  { href: "/admin/queue",         label: "Token Queue",      icon: Ticket },
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
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  // Keep role in ref so pathname changes don't re-trigger auth check
  const roleRef = useRef<UserRole | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (pathname === "/desk/login") { setLoading(false); return; }
      if (!user) { router.push("/login"); setLoading(false); return; }

      // Only fetch role from Firestore if not already loaded
      if (!roleRef.current) {
        const r = await getUserRole(user.uid);
        const allowed = ["admin", "receptionist", "pharmacist"];

        if (!r || !allowed.includes(r)) {
          router.push("/login");
          setLoading(false);
          return;
        }

        roleRef.current = r;
        setRole(r);
        setUserEmail(user.email);
      }

      // Pharmacist redirect check
      const currentRole = roleRef.current;
      if (currentRole === "pharmacist" && !PHARMACIST_DESK_ALLOWED.some((p) => pathname.startsWith(p))) {
        router.push("/desk/billing");
        setLoading(false);
        return;
      }

      setLoading(false);
    });
    return unsub;
  }, [router, pathname]);

  const handleSignOut = async () => {
    roleRef.current = null;
    await signOut(auth);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1729] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname === "/desk/login") return <>{children}</>;

  const sidebarLinks = role === "pharmacist" ? PHARMACIST_LINKS : RECEPTIONIST_LINKS;
  const roleLabel = role === "pharmacist" ? "Pharmacy" : role === "admin" ? "Admin" : "Reception";

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

        {userEmail && (
          <div className="px-4 py-2 border-b border-white/5">
            <p className="text-xs text-white/40 truncate">{userEmail}</p>
          </div>
        )}

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {sidebarLinks.map((link) => {
            // Use exact match to prevent /desk matching /desk/inpatient-card etc.
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

"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserRole } from "@/lib/userRoles";
import { SITE_NAME } from "@/lib/constants";
import Link from "next/link";
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  FileText,
  Gift,
  Ticket,
  LogOut,
  Menu,
  X,
  Hospital,
} from "lucide-react";

const SIDEBAR_LINKS = [
  { href: "/desk", label: "Dashboard", icon: LayoutDashboard },
  { href: "/desk/inpatient-card", label: "In-Patient Cards", icon: CreditCard },
  { href: "/desk/billing", label: "New Invoice", icon: Receipt },
  { href: "/desk/bills", label: "Invoice History", icon: FileText },
  { href: "/desk/wishes", label: "Festive Wishes", icon: Gift },
  { href: "/admin/queue", label: "Token Queue", icon: Ticket },
];

export default function DeskLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (pathname === "/desk/login") {
        setLoading(false);
        return;
      }
      if (!user) {
        router.push("/login");
        setLoading(false);
        return;
      }

      // Check role from Firestore — must be admin or receptionist
      const role = await getUserRole(user.uid);
      const isAdmin = role === "admin";
      const isReceptionist = role === "receptionist";

      if (!isAdmin && !isReceptionist) {
        router.push("/login");
        setLoading(false);
        return;
      }

      setUserEmail(user.email);
      setLoading(false);
    });
    return unsub;
  }, [router, pathname]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname === "/desk/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-primary text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 p-5 border-b border-white/10">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <Hospital className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{SITE_NAME}</p>
            <p className="text-xs text-white/50">Reception</p>
          </div>
        </div>

        {userEmail && (
          <div className="px-5 py-2.5 border-b border-white/10 bg-white/5">
            <p className="text-xs text-white/70 truncate">{userEmail}</p>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            const active =
              link.href === "/desk"
                ? pathname === "/desk"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-white text-primary"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-60">
        <header className="bg-white border-b border-slate-100 px-5 py-3.5 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-slate-600 p-1"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-base font-semibold text-slate-800 capitalize">
            {SIDEBAR_LINKS.find((l) =>
              l.href === "/desk" ? pathname === "/desk" : pathname.startsWith(l.href)
            )?.label ?? "Desk"}
          </h1>
        </header>
        <main className="p-5">{children}</main>
      </div>
    </div>
  );
}

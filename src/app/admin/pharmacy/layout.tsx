"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { signOut } from "@/lib/auth";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Pill,
  ArrowDownUp,
  Truck,
  BarChart3,
  LogOut,
  Hospital,
} from "lucide-react";

const PHARMACY_LINKS = [
  { label: "Dashboard", href: "/admin/pharmacy", icon: LayoutDashboard },
  { label: "Medicines", href: "/admin/pharmacy/medicines", icon: Pill },
  { label: "Stock", href: "/admin/pharmacy/stock", icon: ArrowDownUp },
  { label: "Suppliers", href: "/admin/pharmacy/suppliers", icon: Truck },
  { label: "Reports", href: "/admin/pharmacy/reports", icon: BarChart3 },
];

export default function PharmacyLayout({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin, isPharmacist } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    if (!isAdmin && !isPharmacist) { router.push("/login"); }
  }, [user, loading, isAdmin, isPharmacist, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || (!isAdmin && !isPharmacist)) return null;

  // Admin sees the pharmacy pages through the main admin layout (no override).
  // Pharmacist (non-admin) gets a dedicated pharmacy-only sidebar.
  if (isAdmin) {
    // Don't wrap with a second layout — the parent admin/layout.tsx handles it.
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-muted">
      <aside className="w-60 bg-primary text-white flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Hospital className="w-5 h-5 text-white/70" />
            <div>
              <p className="text-sm font-bold">{SITE_NAME}</p>
              <p className="text-xs text-white/50">Pharmacy</p>
            </div>
          </div>
        </div>

        {user.email && (
          <div className="px-5 py-2.5 border-b border-white/10">
            <p className="text-xs text-white/60 truncate">{user.email}</p>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-0.5">
          {PHARMACY_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/admin/pharmacy"
                ? pathname === "/admin/pharmacy"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white text-primary"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

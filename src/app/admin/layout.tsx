"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthContext } from "@/providers/AuthProvider";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  LayoutDashboard, Calendar, Users, FileText, MessageSquare,
  Star, Settings, Image, BarChart3, Shield, Stethoscope,
  Ticket, CreditCard, Receipt, Pill, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Role-specific sidebar links ─────────────────────────────────────────────

const ADMIN_LINKS = [
  { label: "Dashboard",       href: "/admin",               icon: LayoutDashboard },
  { label: "Token Queue",     href: "/admin/queue",         icon: Ticket },
  { label: "Appointments",    href: "/admin/appointments",  icon: Calendar },
  { label: "Patients",        href: "/admin/patients",      icon: Users },
  { label: "In-Patient Cards",href: "/desk/inpatient-card", icon: CreditCard },
  { label: "Invoices",        href: "/desk/bills",          icon: Receipt },
  { label: "Pharmacy",        href: "/admin/pharmacy",      icon: Pill },
  { label: "Services",        href: "/admin/services",      icon: Stethoscope },
  { label: "Blog",            href: "/admin/blog",          icon: FileText },
  { label: "Messages",        href: "/admin/messages",      icon: MessageSquare },
  { label: "Reviews",         href: "/admin/reviews",       icon: Star },
  { label: "Gallery",         href: "/admin/gallery",       icon: Image },
  { label: "Analytics",       href: "/admin/analytics",     icon: BarChart3 },
  { label: "Roles",           href: "/admin/roles",         icon: Shield },
  { label: "Settings",        href: "/admin/settings",      icon: Settings },
];

const RECEPTIONIST_LINKS = [
  { label: "Token Queue",     href: "/admin/queue",         icon: Ticket },
  { label: "Appointments",    href: "/admin/appointments",  icon: Calendar },
  { label: "Patients",        href: "/admin/patients",      icon: Users },
  { label: "In-Patient Cards",href: "/desk/inpatient-card", icon: CreditCard },
  { label: "Invoices",        href: "/desk/bills",          icon: Receipt },
];

const DOCTOR_LINKS = [
  { label: "Token Queue",     href: "/admin/queue",         icon: Ticket },
  { label: "Appointments",    href: "/admin/appointments",  icon: Calendar },
  { label: "Patients",        href: "/admin/patients",      icon: Users },
];

const PHARMACIST_LINKS = [
  { label: "Pharmacy",        href: "/admin/pharmacy",      icon: Pill },
  { label: "Medicines",       href: "/admin/pharmacy/medicines", icon: Pill },
  { label: "Stock",           href: "/admin/pharmacy/stock", icon: Pill },
  { label: "Suppliers",       href: "/admin/pharmacy/suppliers", icon: Pill },
  { label: "Reports",         href: "/admin/pharmacy/reports", icon: Pill },
  { label: "Invoices",        href: "/desk/bills",          icon: Receipt },
];

// Pages each non-admin role is allowed to access
const RECEPTIONIST_ALLOWED = ["/admin/queue", "/admin/appointments", "/admin/patients"];
const DOCTOR_ALLOWED = ["/admin/queue", "/admin/appointments", "/admin/patients"];
const PHARMACIST_ALLOWED = ["/admin/pharmacy", "/desk/billing", "/desk/bills"];

function isAllowed(pathname: string, allowed: string[]) {
  return allowed.some((p) => pathname.startsWith(p));
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin, isPharmacist, isReceptionist, role } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();

  const isDoctor = role === "doctor";

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1729]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  // Wait for role to load from Firestore before making access decisions
  if (!isAdmin && !isPharmacist && !isReceptionist && !isDoctor && role === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1729]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  // Determine sidebar and allowed pages for this role
  let sidebarLinks = ADMIN_LINKS;
  let roleLabel = "Admin";
  let defaultHref = "/admin";

  if (!isAdmin) {
    if (isReceptionist) {
      sidebarLinks = RECEPTIONIST_LINKS;
      roleLabel = "Reception";
      defaultHref = "/admin/queue";
      // Only redirect within /admin routes — /desk routes are handled by desk layout
      if (pathname.startsWith("/admin") && !isAllowed(pathname, RECEPTIONIST_ALLOWED)) {
        if (typeof window !== "undefined") window.location.href = defaultHref;
        return null;
      }
      // If navigating to /desk, let the desk layout handle it (return null silently)
      if (!pathname.startsWith("/admin")) return null;
    } else if (isDoctor) {
      sidebarLinks = DOCTOR_LINKS;
      roleLabel = "Doctor";
      defaultHref = "/admin/queue";
      if (pathname.startsWith("/admin") && !isAllowed(pathname, DOCTOR_ALLOWED)) {
        if (typeof window !== "undefined") window.location.href = defaultHref;
        return null;
      }
      if (!pathname.startsWith("/admin")) return null;
    } else if (isPharmacist) {
      // Pharmacist uses the dedicated pharmacy sub-layout — don't add admin wrapper
      const allowed = PHARMACIST_ALLOWED.some((p) => pathname.startsWith(p));
      if (!allowed) {
        if (typeof window !== "undefined") window.location.href = "/admin/pharmacy";
        return null;
      }
      return <>{children}</>;
    } else {
      // No recognized role
      return (
        <div className="flex min-h-screen items-center justify-center px-4 bg-[#0f1729]">
          <div className="text-center">
            <Shield className="mx-auto mb-4 h-12 w-12 text-white/30" />
            <h1 className="text-xl font-bold text-white">Access Denied</h1>
            <p className="text-white/40 mt-1 text-sm">No role assigned to your account.</p>
            <a href="/login" className="mt-4 inline-block text-sm text-blue-400 hover:underline">
              Back to Login
            </a>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1729]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col bg-[#0f1729] border-r border-white/5 h-full">
        <div className="px-4 py-4 border-b border-white/5">
          <p className="text-sm font-bold text-white tracking-wide">Dhanvantari Hospital</p>
          <p className="text-[10px] text-white/40 mt-0.5">{roleLabel} Panel</p>
        </div>
        <div className="px-4 py-2.5 border-b border-white/5">
          <p className="text-xs text-white/50 truncate">{user.email}</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {sidebarLinks.map((link) => {
            const isActive = link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                )}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-2 py-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#f0f2f5]">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

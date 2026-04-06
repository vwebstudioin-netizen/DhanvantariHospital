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
  Star, Settings, Image, BarChart3, Shield,
  Ticket, Pill, LogOut, HardDrive,
  CreditCard, Receipt, Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Admin-only links ─────────────────────────────────────────────────────────
const ADMIN_CORE_LINKS = [
  { label: "Dashboard",    href: "/admin",              icon: LayoutDashboard },
  { label: "Token Queue",  href: "/admin/queue",        icon: Ticket },
  { label: "Appointments", href: "/admin/appointments", icon: Calendar },
  { label: "Patients",     href: "/admin/patients",     icon: Users },
  { label: "Blog",         href: "/admin/blog",         icon: FileText },
  { label: "Messages",     href: "/admin/messages",     icon: MessageSquare },
  { label: "Reviews",      href: "/admin/reviews",      icon: Star },
  { label: "Gallery",      href: "/admin/gallery",      icon: Image },
  { label: "Analytics",    href: "/admin/analytics",    icon: BarChart3 },
  { label: "Billing Items", href: "/admin/billing-services", icon: Receipt },
  { label: "Roles",        href: "/admin/roles",        icon: Shield },
  { label: "Backup",       href: "/admin/backup",       icon: HardDrive },
  { label: "Settings",     href: "/admin/settings",     icon: Settings },
];

// ── Staff panel entry points (navigate admin into each role's view) ──────────
const STAFF_PANEL_LINKS = [
  { label: "Reception",  href: "/desk",             icon: CreditCard },
  { label: "Pharmacy",   href: "/pharmacy",         icon: Pill },
  { label: "Doctor",     href: "/doctor/queue",     icon: Stethoscope },
];

// ── Non-admin role sidebars ──────────────────────────────────────────────────
const RECEPTIONIST_LINKS = [
  { label: "Token Queue",      href: "/admin/queue",        icon: Ticket },
  { label: "Appointments",     href: "/admin/appointments", icon: Calendar },
  { label: "Patients",         href: "/admin/patients",     icon: Users },
  { label: "In-Patient Cards", href: "/desk/inpatient-card",icon: CreditCard },
  { label: "Invoices",         href: "/desk/bills",         icon: Receipt },
];

const RECEPTIONIST_ALLOWED = ["/admin/queue", "/admin/appointments", "/admin/patients"];
const PHARMACIST_ALLOWED   = ["/pharmacy"];

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

  if (!isAdmin && !isPharmacist && !isReceptionist && !isDoctor && role === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1729]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  // ── Non-admin role routing ────────────────────────────────────────────────
  if (!isAdmin) {
    if (isReceptionist) {
      if (pathname.startsWith("/admin") && !isAllowed(pathname, RECEPTIONIST_ALLOWED)) {
        if (typeof window !== "undefined") window.location.href = "/admin/queue";
        return null;
      }
      if (!pathname.startsWith("/admin")) return null; // desk layout handles /desk/*

      return (
        <SidebarLayout
          links={RECEPTIONIST_LINKS}
          roleLabel="Reception"
          email={user.email ?? ""}
          onLogout={handleLogout}
          pathname={pathname}
        >
          {children}
        </SidebarLayout>
      );
    }

    if (isDoctor) {
      // Doctor has a dedicated /doctor/* route with its own layout
      if (typeof window !== "undefined") window.location.href = "/doctor/queue";
      return null;
    }

    if (isPharmacist) {
      if (!isAllowed(pathname, PHARMACIST_ALLOWED)) {
        if (typeof window !== "undefined") window.location.href = "/pharmacy";
        return null;
      }
      return <>{children}</>;  // pharmacy layout handles the UI
    }

    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-[#0f1729]">
        <div className="text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-white/30" />
          <h1 className="text-xl font-bold text-white">Access Denied</h1>
          <p className="text-white/40 mt-1 text-sm">No role assigned to your account.</p>
          <a href="/login" className="mt-4 inline-block text-sm text-blue-400 hover:underline">Back to Login</a>
        </div>
      </div>
    );
  }

  // ── Admin layout with grouped sidebar ────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1729]">
      <aside className="w-56 shrink-0 flex flex-col bg-[#0f1729] border-r border-white/5 h-full">
        <div className="px-4 py-4 border-b border-white/5">
          <p className="text-sm font-bold text-white tracking-wide">Dhanvantari Hospital</p>
          <p className="text-[10px] text-white/40 mt-0.5">Admin Panel</p>
        </div>
        <div className="px-4 py-2.5 border-b border-white/5">
          <p className="text-xs text-white/50 truncate">{user.email}</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {/* Admin-only links */}
          {ADMIN_CORE_LINKS.map((link) => {
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

          {/* Divider — Staff Panels */}
          <div className="pt-3 pb-1 px-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Staff Panels</p>
          </div>
          {STAFF_PANEL_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
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

// ── Shared sidebar layout for non-admin roles ─────────────────────────────────
function SidebarLayout({
  links, roleLabel, email, onLogout, pathname, children,
}: {
  links: { label: string; href: string; icon: React.ElementType }[];
  roleLabel: string;
  email: string;
  onLogout: () => void;
  pathname: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1729]">
      <aside className="w-56 shrink-0 flex flex-col bg-[#0f1729] border-r border-white/5 h-full">
        <div className="px-4 py-4 border-b border-white/5">
          <p className="text-sm font-bold text-white tracking-wide">Dhanvantari Hospital</p>
          <p className="text-[10px] text-white/40 mt-0.5">{roleLabel} Panel</p>
        </div>
        <div className="px-4 py-2.5 border-b border-white/5">
          <p className="text-xs text-white/50 truncate">{email}</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {links.map((link) => {
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
            onClick={onLogout}
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

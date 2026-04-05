"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Star,
  Settings,
  Image,
  BarChart3,
  Shield,
  Stethoscope,
  Ticket,
  CreditCard,
  Receipt,
  Pill,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Token Queue", href: "/admin/queue", icon: Ticket },
  { label: "Appointments", href: "/admin/appointments", icon: Calendar },
  { label: "Patients", href: "/admin/patients", icon: Users },
  { label: "In-Patient Cards", href: "/desk/inpatient-card", icon: CreditCard },
  { label: "Invoices", href: "/desk/bills", icon: Receipt },
  { label: "Pharmacy", href: "/admin/pharmacy", icon: Pill },
  { label: "Services", href: "/admin/services", icon: Stethoscope },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Roles", href: "/admin/roles", icon: Shield },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin, isPharmacist, isReceptionist } = useAuthContext();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  // Pharmacist landed on /admin — redirect to pharmacy
  if (!isAdmin && isPharmacist) {
    if (typeof window !== "undefined") window.location.href = "/admin/pharmacy";
    return null;
  }

  // Receptionist landed on /admin — redirect to desk
  if (!isAdmin && isReceptionist) {
    if (typeof window !== "undefined") window.location.href = "/desk";
    return null;
  }

  // No role at all
  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <Shield className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            Admin Access Required
          </h1>
          <p className="text-muted-foreground">
            You need admin privileges to access this area.
          </p>
          <a href="/login" className="mt-4 inline-block text-sm text-primary hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-56">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-4 border-b border-border pb-4">
              <p className="font-semibold text-foreground">Admin Panel</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <nav className="space-y-0.5">
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                    pathname === link.href
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

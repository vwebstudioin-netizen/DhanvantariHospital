"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
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
  LogOut,
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
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

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
    <div className="flex h-screen overflow-hidden bg-[#0f1729]">
      {/* Sidebar — full height, dark, software style */}
      <aside className="w-56 shrink-0 flex flex-col bg-[#0f1729] border-r border-white/5 h-full">
        {/* Header */}
        <div className="px-4 py-4 border-b border-white/5">
          <p className="text-sm font-bold text-white tracking-wide">Dhanvantari Hospital</p>
          <p className="text-[10px] text-white/40 mt-0.5">Admin Panel</p>
        </div>
        {/* User */}
        <div className="px-4 py-2.5 border-b border-white/5">
          <p className="text-xs text-white/50 truncate">{user.email}</p>
        </div>
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                (link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href))
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Logout */}
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

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-[#f0f2f5]">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

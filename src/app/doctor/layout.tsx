"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Ticket, Calendar, Users, LogOut, Hospital, ArrowLeft,
} from "lucide-react";

const DOCTOR_LINKS = [
  { label: "Token Queue",  href: "/doctor/queue",        icon: Ticket },
  { label: "Appointments", href: "/doctor/appointments", icon: Calendar },
  { label: "Patients",     href: "/doctor/patients",     icon: Users },
];

export default function DoctorLayout({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin, role } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const isDoctor = role === "doctor";

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    if (!isAdmin && !isDoctor) { router.push("/login"); }
  }, [user, loading, isAdmin, isDoctor, router]);

  if (loading || (!isAdmin && !isDoctor)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1729]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1729]">
      <aside className="w-56 shrink-0 flex flex-col bg-[#0f1729] border-r border-white/5">
        {/* Back to Admin — only for admin users */}
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors border-b border-white/10 text-white/60 hover:text-white text-xs font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Admin Panel
          </Link>
        )}

        <div className="px-4 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Hospital className="w-4 h-4 text-white/50" />
            <div>
              <p className="text-sm font-bold text-white">{SITE_NAME}</p>
              <p className="text-[10px] text-white/40">Doctor Panel</p>
            </div>
          </div>
        </div>

        {user?.email && (
          <div className="px-4 py-2.5 border-b border-white/5">
            <p className="text-xs text-white/50 truncate">{user.email}</p>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {DOCTOR_LINKS.map((link) => {
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

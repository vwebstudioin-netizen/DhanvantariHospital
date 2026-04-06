"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { LayoutDashboard, Calendar, MessageSquare, User, Star, Bell, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

const portalLinks = [
  { label: "Dashboard", href: "/portal", icon: LayoutDashboard },
  { label: "Appointments", href: "/portal/appointments", icon: Calendar },
  { label: "Messages", href: "/portal/messages", icon: MessageSquare },
  { label: "Profile", href: "/portal/profile", icon: User },
  { label: "Reviews", href: "/portal/reviews", icon: Star },
  { label: "Notifications", href: "/portal/notifications", icon: Bell },
];

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && pathname !== "/portal/login" && pathname !== "/portal/register") {
      router.push("/portal/login");
    }
  }, [user, loading, pathname, router]);

  if (loading || (!user && pathname !== "/portal/login" && pathname !== "/portal/register")) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-64">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-4 border-b border-border pb-4">
              <p className="font-semibold text-foreground">Patient Portal</p>
              <p className="text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
            <nav className="space-y-1">
              {portalLinks.map((link) => (
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
            <div className="mt-3 border-t border-border pt-3">
              <button
                onClick={async () => { await signOut(auth); router.push("/portal/login"); }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

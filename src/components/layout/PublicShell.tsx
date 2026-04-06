"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";

// Routes that are app/software views — no website header/footer
const APP_PREFIXES = [
  "/admin",
  "/desk",
  "/doctor",
  "/pharmacy",
  "/login",
  "/portal",       // Patient portal has its own layout
  "/queue/display", // TV display is full-screen, no header/footer
];

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isApp = APP_PREFIXES.some((r) => pathname.startsWith(r));

  if (isApp) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

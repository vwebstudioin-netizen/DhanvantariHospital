import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import AuthProvider from "@/providers/AuthProvider";
import LocationProvider from "@/providers/LocationProvider";
import PublicShell from "@/components/layout/PublicShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dhanvantari Hospital — Advanced Multi-Specialty Healthcare",
    template: "%s | Dhanvantari Hospital",
  },
  description:
    "Dhanvantari Hospital — Emergency Treatment for Accident Cases Available. Multi-specialty care: General Medicine, Surgery, Gynecology, Pediatrics, Orthopedics, Neurology, Cardiology, Critical Care.",
  keywords: [
    "Dhanvantari Hospital",
    "emergency hospital",
    "accident treatment",
    "multi-specialty hospital",
    "critical care",
    "general surgery",
    "gynecology",
    "orthopedics",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Dhanvantari Hospital",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <LocationProvider>
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                  },
                  error: {
                    style: {
                      background: "#fef2f2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                    },
                    iconTheme: { primary: "#dc2626", secondary: "#fff" },
                  },
                  success: {
                    style: {
                      background: "#f0fdf4",
                      color: "#16a34a",
                      border: "1px solid #bbf7d0",
                    },
                    iconTheme: { primary: "#16a34a", secondary: "#fff" },
                  },
                }}
              />
              <PublicShell>{children}</PublicShell>
            </LocationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

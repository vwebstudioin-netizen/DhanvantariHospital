import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import AuthProvider from "@/providers/AuthProvider";
import LocationProvider from "@/providers/LocationProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
    locale: "en_US",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <LocationProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </LocationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

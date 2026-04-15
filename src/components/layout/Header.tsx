"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Clock, MapPin, Search, Menu, X, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnnouncementBar from "./AnnouncementBar";
import { SITE_NAME, NAV_LINKS, CONTACT_PHONE, CONTACT_PHONE2, CONTACT_PHONE3, CONTACT_EMAIL } from "@/lib/constants";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      {/* Announcement Bar */}
      {showAnnouncement && (
        <AnnouncementBar
          text="🚨 Emergency Treatment for Accident Cases — Available 24/7 | Book Appointments Online"
          link="/book"
          onClose={() => setShowAnnouncement(false)}
        />
      )}

      {/* Top Bar */}
      <div className="hidden border-b border-border bg-muted/50 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" /> {CONTACT_PHONE} / {CONTACT_PHONE2} / {CONTACT_PHONE3}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" /> {CONTACT_EMAIL}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> Emergency: Open 24/7
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/locations" className="flex items-center gap-1 hover:text-primary">
              <MapPin className="h-3 w-3" /> Location
            </Link>
            <Link href="/portal" className="flex items-center gap-1 hover:text-primary">
              <User className="h-3 w-3" /> Patient Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.jpg"
            alt={SITE_NAME}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <span className="text-lg font-bold text-foreground">{SITE_NAME}</span>
            <span className="hidden text-[10px] text-muted-foreground sm:block">
              Emergency Treatment for Accident Cases Available
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() =>
                "children" in link && link.children
                  ? setActiveDropdown(link.label)
                  : undefined
              }
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary",
                  activeDropdown === link.label && "text-primary"
                )}
              >
                {link.label}
                {"children" in link && link.children && (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Link>

              {/* Dropdown */}
              {"children" in link &&
                link.children &&
                activeDropdown === link.label && (
                  <div className="absolute left-0 top-full z-50 w-52 rounded-lg border border-border bg-card py-2 shadow-lg">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/book" className="hidden sm:block">
            <Button size="sm">Book Appointment</Button>
          </Link>
          <button
            className="rounded-md p-2 text-foreground hover:bg-muted lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 lg:hidden">
          <nav className="space-y-1">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted hover:text-primary"
                >
                  {link.label}
                </Link>
                {"children" in link &&
                  link.children &&
                  link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-md px-6 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                    >
                      {child.label}
                    </Link>
                  ))}
              </div>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/book" onClick={() => setMobileOpen(false)}>
              <Button className="w-full">Book Appointment</Button>
            </Link>
            <Link href="/portal" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full">
                Patient Portal
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react";
import {
  SITE_NAME,
  CONTACT_PHONE,
  CONTACT_PHONE2,
  CONTACT_PHONE3,
  CONTACT_EMAIL,
  HOSPITAL_ADDRESS,
  FOOTER_LINKS,
  SOCIAL_LINKS,
} from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.jpg"
                alt={SITE_NAME}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="text-lg font-bold text-foreground">
                {SITE_NAME}
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Emergency Treatment for Accident Cases Available. Multi-specialty hospital with Critical Care Unit — open 24/7.
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>{CONTACT_PHONE} / {CONTACT_PHONE2} / {CONTACT_PHONE3}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> {CONTACT_EMAIL}
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" /> {HOSPITAL_ADDRESS}
              </p>
            </div>
            {/* Social */}
            <div className="mt-4 flex gap-3">
              {[
                { icon: Facebook, href: SOCIAL_LINKS.facebook },
                { icon: Instagram, href: SOCIAL_LINKS.instagram },
                { icon: Twitter, href: SOCIAL_LINKS.twitter },
                { icon: Youtube, href: SOCIAL_LINKS.youtube },
                { icon: Linkedin, href: SOCIAL_LINKS.linkedin },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Patient Resources */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Patient Resources
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.patientResources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Company
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {currentYear} {SITE_NAME}. All rights reserved.</p>
          <p>
            Designed &amp; developed by{" "}
            <a href="https://vwebstudio.in" target="_blank" rel="noopener noreferrer"
              className="font-medium text-primary hover:underline">
              Vwebstudio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

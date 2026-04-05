import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { NAV_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Complete sitemap for Dhanvantari Hospital — find any page on our website.",
};

const additionalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Patient Portal", href: "/portal" },
  { label: "Admin Dashboard", href: "/admin" },
];

export default function SitemapPage() {
  return (
    <>
      <PageHero
        title="Sitemap"
        subtitle="Find any page on our website."
        breadcrumbs={[{ label: "Sitemap" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Main Nav */}
            {NAV_LINKS.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="text-lg font-semibold text-foreground hover:text-primary"
                >
                  {link.label}
                </Link>
                {"children" in link && link.children && (
                  <ul className="mt-2 space-y-1 pl-4">
                    {link.children.map((child: { label: string; href: string }) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Additional */}
            <div>
              <p className="text-lg font-semibold text-foreground">Other Pages</p>
              <ul className="mt-2 space-y-1 pl-4">
                {additionalLinks.map((link) => (
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
      </section>
    </>
  );
}

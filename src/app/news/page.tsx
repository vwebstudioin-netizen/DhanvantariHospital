import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "News & Announcements",
  description: "Stay up to date with the latest news, events, and announcements from Dhanvantari Hospital.",
};

const demoNews = [
  {
    slug: "new-mri-suite-opening",
    title: "State-of-the-Art MRI Suite Opening at Main Campus",
    excerpt: "Dhanvantari Hospital is proud to announce the opening of our new advanced MRI imaging suite, featuring the latest 3T MRI technology for enhanced diagnostic capabilities.",
    date: "2024-11-22",
    category: "Announcement",
  },
  {
    slug: "holiday-hours-2024",
    title: "Holiday Hours for 2024-2025 Season",
    excerpt: "Please review our adjusted hours of operation for the upcoming holiday season across all three locations.",
    date: "2024-11-18",
    category: "Notice",
  },
  {
    slug: "flu-vaccination-drive",
    title: "Annual Flu Vaccination Drive — Walk-Ins Welcome",
    excerpt: "Protect yourself and your family this flu season. Walk-in flu shots are available at all Dhanvantari Hospital locations through December 31.",
    date: "2024-11-10",
    category: "Event",
  },
  {
    slug: "telehealth-expansion",
    title: "Expanded Telehealth Services Now Available",
    excerpt: "We've expanded our telehealth offerings to include 8 departments, making it easier to access quality care from the comfort of your home.",
    date: "2024-10-30",
    category: "Announcement",
  },
];

export default function NewsPage() {
  return (
    <>
      <PageHero
        title="News & Announcements"
        subtitle="Stay informed about the latest developments at Dhanvantari Hospital."
        breadcrumbs={[{ label: "News" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl space-y-6">
          {demoNews.map((item) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="group block rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {item.category}
                  </Badge>
                  <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.excerpt}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> {item.date}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read More <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

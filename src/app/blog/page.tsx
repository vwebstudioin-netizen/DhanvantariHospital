import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Health tips, medical news, and wellness articles from Dhanvantari Hospital's team of specialists.",
};

const demoPosts = [
  {
    slug: "heart-health-tips-winter",
    title: "5 Heart Health Tips for Winter",
    excerpt: "Cold weather can put extra stress on your heart. Learn how to protect your cardiovascular health during the winter months.",
    author: "Dr. Michael Rodriguez",
    date: "2024-11-20",
    readTime: "5 min",
    category: "Cardiology",
    image: "/images/blog/heart-health.jpg",
  },
  {
    slug: "childhood-vaccination-guide",
    title: "A Parent's Guide to Childhood Vaccinations",
    excerpt: "Everything you need to know about recommended vaccinations for children from birth through adolescence.",
    author: "Dr. Emily Johnson",
    date: "2024-11-15",
    readTime: "7 min",
    category: "Pediatrics",
    image: "/images/blog/vaccinations.jpg",
  },
  {
    slug: "managing-back-pain",
    title: "Managing Chronic Back Pain: Non-Surgical Options",
    excerpt: "Explore conservative treatment approaches for chronic back pain, including physical therapy and lifestyle modifications.",
    author: "Dr. James Park",
    date: "2024-11-10",
    readTime: "6 min",
    category: "Orthopedics",
    image: "/images/blog/back-pain.jpg",
  },
  {
    slug: "skin-care-seasonal-changes",
    title: "How Seasonal Changes Affect Your Skin",
    excerpt: "Dermatologist-approved tips for adapting your skincare routine as the seasons change.",
    author: "Dr. Aisha Patel",
    date: "2024-11-05",
    readTime: "4 min",
    category: "Dermatology",
    image: "/images/blog/skincare.jpg",
  },
  {
    slug: "mental-health-workplace",
    title: "Prioritizing Mental Health in the Workplace",
    excerpt: "Practical strategies for maintaining mental wellness and managing stress in your professional life.",
    author: "Dr. David Williams",
    date: "2024-10-28",
    readTime: "6 min",
    category: "Mental Health",
    image: "/images/blog/mental-health.jpg",
  },
  {
    slug: "prenatal-care-essentials",
    title: "Essential Prenatal Care: What to Expect",
    excerpt: "A comprehensive guide to prenatal visits, screenings, and what expecting mothers should know.",
    author: "Dr. Lisa Martinez",
    date: "2024-10-20",
    readTime: "8 min",
    category: "Women's Health",
    image: "/images/blog/prenatal.jpg",
  },
];

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Health Blog"
        subtitle="Expert health insights, tips, and news from our team of specialists."
        breadcrumbs={[{ label: "Blog" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {demoPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="h-48 bg-muted" />
                <div className="flex flex-1 flex-col p-6">
                  <Badge variant="secondary" className="mb-3 w-fit text-xs">
                    {post.category}
                  </Badge>
                  <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title,
    description: `Read "${title}" on the Dhanvantari Hospital health blog.`,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <PageHero
        title={title}
        subtitle="Dhanvantari Hospital Health Blog"
        breadcrumbs={[
          { label: "Blog", href: "/blog" },
          { label: title },
        ]}
      />

      <article className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> November 20, 2024
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 5 min read
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" /> Dhanvantari Hospital Team
            </span>
          </div>

          <div className="mb-8 h-64 rounded-xl bg-muted" />

          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-muted-foreground leading-relaxed">
              This is a demo blog post. In a production environment, blog
              content would be fetched from the Firestore database and rendered
              with rich formatting, images, and embedded media.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Dhanvantari Hospital&apos;s blog features expert health insights from our
              team of 8 Specialties across 8 Departments. We cover topics
              including preventive care, chronic condition management, wellness
              tips, and the latest medical developments.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our goal is to empower patients with the knowledge they need to
              make informed decisions about their health. Subscribe to our
              newsletter to receive new articles directly in your inbox.
            </p>
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <Link href="/blog">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Blog
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}

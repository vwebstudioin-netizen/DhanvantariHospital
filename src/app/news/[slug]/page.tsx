import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";

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
    description: `Read "${title}" — news from Dhanvantari Hospital.`,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <PageHero
        title={title}
        subtitle="Dhanvantari Hospital News"
        breadcrumbs={[
          { label: "News", href: "/news" },
          { label: title },
        ]}
      />

      <article className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" /> November 2024
          </p>

          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              This is a demo news article. In a production environment, news
              content would be fetched from the Firestore database with full
              formatting, images, and media embeds.
            </p>
            <p>
              Dhanvantari Hospital regularly shares updates about new services,
              facility improvements, community events, and health advisories to
              keep patients and the community informed.
            </p>
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <Link href="/news">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to News
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

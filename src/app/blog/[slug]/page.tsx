"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags?: string;
  status: string;
  createdAt: any;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function load() {
      try {
        const snap = await getDocs(collection(db, "blogPosts"));
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as BlogPost[];
        const found = all.find((p) => p.slug === slug && p.status === "published") ?? null;
        setPost(found);
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const formatDate = (createdAt: any) => {
    if (!createdAt?.toDate) return "";
    return createdAt.toDate().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  };

  if (loading) {
    return (
      <>
        <PageHero title="Loading..." subtitle="Dhanvantari Hospital Health Blog" breadcrumbs={[{ label: "Blog", href: "/blog" }, { label: "Loading..." }]} />
        <div className="px-4 py-20 text-center text-muted-foreground">Loading post...</div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <PageHero title="Post Not Found" subtitle="Dhanvantari Hospital Health Blog" breadcrumbs={[{ label: "Blog", href: "/blog" }, { label: "Not Found" }]} />
        <div className="px-4 py-20 text-center">
          <p className="text-2xl font-semibold text-foreground mb-2">Post not found</p>
          <p className="text-muted-foreground mb-6">This post may have been removed or is not yet published.</p>
          <Link href="/blog">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Button>
          </Link>
        </div>
      </>
    );
  }

  const paragraphs = post.content.split("\n").filter((p) => p.trim().length > 0);

  return (
    <>
      <PageHero
        title={post.title}
        subtitle="Dhanvantari Hospital Health Blog"
        breadcrumbs={[
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <article className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          {/* Meta row */}
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.createdAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.createdAt)}
              </span>
            )}
            {post.author && (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {post.author}
              </span>
            )}
            {post.category && (
              <span className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                {post.category}
              </span>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed border-l-4 border-primary pl-4">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none text-foreground space-y-4">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">{para}</p>
            ))}
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer nav */}
          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <Link href="/blog">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

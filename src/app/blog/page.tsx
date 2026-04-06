"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PageHero from "@/components/layout/PageHero";
import { Calendar, ArrowRight, User, BookOpen } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  createdAt: any;
  status: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(
          query(collection(db, "blogPosts"), where("status", "==", "published"), orderBy("createdAt", "desc"))
        );
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost)));
      } catch {
        // fallback: fetch all and filter client-side (avoids composite index)
        try {
          const snap = await getDocs(collection(db, "blogPosts"));
          const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
          setPosts(all.filter(p => p.status === "published")
            .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)));
        } catch { /* silent */ }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];
  const filtered = activeCategory === "All" ? posts : posts.filter(p => p.category === activeCategory);

  return (
    <div>
      <PageHero
        title="Health & Wellness Blog"
        subtitle="Expert insights, medical tips, and wellness articles from our specialists"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Category filter */}
        {!loading && categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 animate-pulse h-48" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No articles published yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Check back soon for health tips and medical articles.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-card border border-border rounded-xl p-6 hover:border-primary hover:shadow-md transition-all flex flex-col"
              >
                {post.category && (
                  <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3 w-fit">
                    {post.category}
                  </span>
                )}
                <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {post.author && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />{post.author}
                      </span>
                    )}
                    {post.createdAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.createdAt?.toDate?.()?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) ?? "—"}
                      </span>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

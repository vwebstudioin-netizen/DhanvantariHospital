"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PageHero from "@/components/layout/PageHero";

interface GalleryImage {
  id: string;
  title: string;
  url: string;
  category: string;
  description?: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(query(collection(db, "gallery"), orderBy("createdAt", "desc")));
        setImages(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as GalleryImage[]);
      } catch {
        // silently fail on public page
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ["All", ...Array.from(new Set(images.map((img) => img.category).filter(Boolean)))];

  const filtered = activeCategory === "All" ? images : images.filter((img) => img.category === activeCategory);

  return (
    <>
      <PageHero
        title="Photo Gallery"
        subtitle="Take a virtual tour of our facilities, technology, and team."
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading gallery...</div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl font-semibold text-foreground mb-2">Gallery coming soon</p>
              <p className="text-muted-foreground">Check back later for photos of our facilities and team.</p>
            </div>
          ) : (
            <>
              {/* Category filter */}
              <div className="mb-8 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      activeCategory === cat
                        ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                        : "bg-transparent text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Gallery grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((img) => (
                  <div
                    key={img.id}
                    className="group relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-muted"
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/60 via-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <div>
                        <p className="text-sm font-medium text-white">{img.title}</p>
                        <p className="text-xs text-white/70">{img.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

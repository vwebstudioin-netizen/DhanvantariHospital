"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import StarRating from "@/components/shared/StarRating";
import { MessageSquarePlus } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: any;
  status: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, "reviews"));
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Review[];
        const approved = all
          .filter((r) => r.status === "approved")
          .sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() ?? 0;
            const bTime = b.createdAt?.toMillis?.() ?? 0;
            return bTime - aTime;
          });
        setReviews(approved);
      } catch {
        // silently fail on public page
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const formatDate = (createdAt: any) => {
    if (!createdAt?.toDate) return "";
    return createdAt.toDate().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <>
      <PageHero
        title="Patient Reviews"
        subtitle="Read what our patients have to say about their care experience."
        breadcrumbs={[{ label: "Reviews" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl font-semibold text-foreground mb-2">No reviews yet</p>
              <p className="text-muted-foreground mb-6">Be the first to share your experience.</p>
              <Link href="/reviews/submit"
                className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
                <MessageSquarePlus className="w-4 h-4" /> Write a Review
              </Link>
            </div>
          ) : (
            <>
              {/* Average rating summary */}
              <div className="mb-10 flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center sm:flex-row sm:text-left">
                <div className="flex flex-col items-center sm:items-start">
                  <p className="text-5xl font-bold text-primary">{avgRating.toFixed(1)}</p>
                  <div className="mt-1">
                    <StarRating rating={Math.round(avgRating)} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Based on {reviews.length} verified review{reviews.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex-1 flex justify-center sm:justify-end">
                  <Link href="/reviews/submit"
                    className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
                    <MessageSquarePlus className="w-4 h-4" /> Write a Review
                  </Link>
                </div>
              </div>

              {/* Review cards */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-foreground">{review.name}</p>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(review.createdAt)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
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

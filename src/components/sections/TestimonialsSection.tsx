"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import StarRating from "@/components/shared/StarRating";
import SectionHeader from "@/components/shared/SectionHeader";
import Carousel from "@/components/shared/Carousel";
import { Quote } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: any;
}

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, "reviews"));
        const approved = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((r: any) => r.status === "approved")
          .slice(0, 6) as Review[];
        setReviews(approved);
      } catch {
        // silently fail
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  // Don't render until loaded; hide section if fewer than 3 approved reviews
  if (!loaded || reviews.length < 3) return null;

  return (
    <section className="px-4 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Patient Reviews"
          title="What Our Patients Say"
          subtitle="Real stories from real patients about their experience with Dhanvantari Hospital."
        />

        <Carousel autoplay delay={6000}>
          {reviews.map((r) => (
            <div key={r.id} className="px-4">
              <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8 text-center">
                <Quote className="mx-auto mb-4 h-8 w-8 text-primary/30" />
                <p className="mb-4 text-lg text-foreground leading-relaxed italic">
                  &ldquo;{r.comment}&rdquo;
                </p>
                <div className="mb-2 flex justify-center">
                  <StarRating rating={r.rating} />
                </div>
                <p className="font-semibold text-foreground">{r.name}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

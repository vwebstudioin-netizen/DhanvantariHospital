"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/shared/StarRating";
import { Plus } from "lucide-react";

const demoReviews = [
  { id: "1", doctor: "Dr. Sarah Chen", date: "Nov 5, 2024", rating: 5, text: "Excellent care, very thorough and attentive." },
  { id: "2", doctor: "Dr. Aisha Patel", date: "Oct 20, 2024", rating: 4, text: "Good experience, minimal wait time." },
];

export default function PortalReviews() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My Reviews</h1>
        <Link href="/portal/reviews/new">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Write Review
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {demoReviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-border bg-card p-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold text-foreground">{review.doctor}</p>
              <StarRating rating={review.rating} />
            </div>
            <p className="text-sm text-muted-foreground">{review.text}</p>
            <p className="mt-2 text-xs text-muted-foreground">{review.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

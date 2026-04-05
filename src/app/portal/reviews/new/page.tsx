"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Star } from "lucide-react";

export default function NewReviewPage() {
  const [doctor, setDoctor] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  return (
    <div>
      <Link href="/portal/reviews" className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Reviews
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-foreground">Write a Review</h1>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Physician</label>
            <select
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">Select a physician...</option>
              <option value="dr-chen">Dr. Sarah Chen</option>
              <option value="dr-rodriguez">Dr. Michael Rodriguez</option>
              <option value="dr-johnson">Dr. Emily Johnson</option>
              <option value="dr-patel">Dr. Aisha Patel</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition hover:scale-110"
                >
                  <Star
                    className={`h-7 w-7 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Your Review</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              placeholder="Share your experience..."
            />
          </div>

          <div className="flex justify-end">
            <Button className="gap-2" disabled={!doctor || !rating || !text}>
              <Send className="h-4 w-4" /> Submit Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

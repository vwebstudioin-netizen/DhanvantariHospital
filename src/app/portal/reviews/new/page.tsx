"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Star } from "lucide-react";
import { submitReview } from "@/lib/reviews";
import { useAuthContext } from "@/providers/AuthProvider";
import toast from "react-hot-toast";

const DEPARTMENTS = [
  "General Medicine", "General Surgery", "Gynecology", "Pediatrics",
  "Orthopedics", "Neurology", "Cardiology", "Critical Care / Emergency", "Other",
];

export default function NewReviewPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [department, setDepartment] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating) { toast.error("Please select a star rating"); return; }
    if (!comment.trim() || comment.trim().length < 10) { toast.error("Please write at least 10 characters"); return; }
    setSubmitting(true);
    try {
      await submitReview({
        patientName: user?.displayName || "Portal Patient",
        patientPhone: undefined,
        department: department || undefined,
        rating,
        comment: comment.trim(),
      });
      toast.success("Review submitted! It will appear after admin approval.");
      router.push("/portal/reviews");
    } catch (err: any) {
      toast.error(err?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const RATING_LABELS: Record<number, string> = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Very Good", 5: "Excellent" };

  return (
    <div>
      <Link href="/portal/reviews" className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Reviews
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Write a Review</h1>

      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        {/* Department */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Department (optional)</label>
          <select value={department} onChange={e => setDepartment(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">Select department...</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Star rating */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Rating *</label>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(star => (
              <button key={star} type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform hover:scale-110">
                <Star className={`h-8 w-8 ${star <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
              </button>
            ))}
            {(hover || rating) > 0 && (
              <span className="ml-2 text-sm font-medium text-muted-foreground">{RATING_LABELS[hover || rating]}</span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Your Experience *</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            rows={5} placeholder="Share your experience (min 10 characters)..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          <p className="text-xs text-muted-foreground mt-1">{comment.length} characters</p>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSubmit} disabled={submitting || !rating || comment.trim().length < 10}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-50 transition-colors">
            {submitting ? "Submitting…" : <><Send className="h-4 w-4" /> Submit Review</>}
          </button>
        </div>
      </div>
    </div>
  );
}

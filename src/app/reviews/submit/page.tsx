"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Star, CheckCircle, Hospital } from "lucide-react";
import { submitReview } from "@/lib/reviews";
import { SITE_NAME } from "@/lib/constants";
import toast from "react-hot-toast";

const DEPARTMENTS = [
  "General Medicine",
  "General Surgery",
  "Gynecology",
  "Pediatrics",
  "Orthopedics",
  "Neurology",
  "Cardiology",
  "Critical Care / Emergency",
  "Other",
];

function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-10 h-10 ${
              star <= (hover || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

function SubmitForm() {
  const params = useSearchParams();
  const prefillName = params.get("name") || "";
  const ref = params.get("ref") || "";

  const [rating, setRating] = useState(0);
  const [name, setName] = useState(prefillName);
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a star rating"); return; }
    if (!comment.trim()) { toast.error("Please write a short comment"); return; }
    setLoading(true);
    try {
      await submitReview({ patientName: name || "Anonymous", patientPhone: phone || undefined, department: department || undefined, rating, comment: comment.trim(), ref: ref || undefined });
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground">Thank You!</h2>
        <p className="text-muted-foreground mt-2">
          Your review has been submitted and will appear on our website after a quick review.
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          We really appreciate your feedback — it helps us improve.
        </p>
        <a href="/" className="mt-6 inline-block text-primary hover:underline text-sm font-medium">
          Back to {SITE_NAME}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Star Rating */}
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground mb-3">How would you rate your visit?</p>
        <div className="flex justify-center">
          <StarSelector value={rating} onChange={setRating} />
        </div>
        {rating > 0 && (
          <p className="mt-2 text-sm font-semibold text-primary">{RATING_LABELS[rating]}</p>
        )}
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Department visited</label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select department (optional)</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Your experience <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Tell us about your experience — doctors, staff, waiting time, facilities..."
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          required
        />
      </div>

      {/* Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Patient name (optional)"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Phone (optional)</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>

      <p className="text-xs text-center text-muted-foreground">
        Reviews are moderated before appearing on our website.
      </p>
    </form>
  );
}

export default function ReviewSubmitPage() {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Hospital className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{SITE_NAME}</h1>
          <p className="text-muted-foreground text-sm mt-1">Share your experience</p>
        </div>
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <Suspense fallback={<div className="text-center py-8 text-muted-foreground">Loading...</div>}>
            <SubmitForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

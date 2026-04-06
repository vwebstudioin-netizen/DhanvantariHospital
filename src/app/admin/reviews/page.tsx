"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Trash2, Star } from "lucide-react";
import { getAllReviews, approveReview, rejectReview, deleteReview, type Review } from "@/lib/reviews";
import toast from "react-hot-toast";

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-4 h-4 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
};

const SAMPLE_REVIEWS: Review[] = [
  { id: "1", patientName: "Ravi Kumar", patientPhone: "9876543210", department: "Orthopedics", rating: 5, comment: "Excellent fracture treatment. The doctor was very skilled and the staff very caring. Recovered quickly.", status: "pending", ref: "INV-0001", createdAt: { toDate: () => new Date("2026-04-04") } as any },
  { id: "2", patientName: "Priya Patel", patientPhone: "9876543211", department: "Gynecology", rating: 5, comment: "Very comfortable delivery experience. The nursing staff was amazing throughout my stay.", status: "approved", createdAt: { toDate: () => new Date("2026-04-03") } as any },
  { id: "3", patientName: "Anand Sharma", department: "Emergency", rating: 4, comment: "Quick emergency response for road accident. Doctors were very experienced. Good hospital.", status: "pending", createdAt: { toDate: () => new Date("2026-04-02") } as any },
];

type FilterTab = "all" | "pending" | "approved" | "rejected";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [filter, setFilter] = useState<FilterTab>("pending");

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllReviews();
        setReviews(data); // Always use Firestore data, even if empty
      } catch {
        // Falls back to sample data
      }
    }
    load();
  }, []);

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);
  const approvedCount = reviews.filter(r => r.status === "approved").length;
  const avgRating = approvedCount > 0
    ? (reviews.filter(r => r.status === "approved").reduce((s, r) => s + r.rating, 0) / approvedCount).toFixed(1)
    : "—";

  const handle = async (action: "approve" | "reject" | "delete", id: string) => {
    const prev = reviews; // snapshot for rollback
    try {
      if (action === "approve") {
        setReviews(p => p.map(r => r.id === id ? { ...r, status: "approved" as const } : r));
        await approveReview(id);
        toast.success("Review approved — now visible on website");
      } else if (action === "reject") {
        setReviews(p => p.map(r => r.id === id ? { ...r, status: "rejected" as const } : r));
        await rejectReview(id);
        toast.success("Review hidden");
      } else {
        setReviews(p => p.filter(r => r.id !== id));
        await deleteReview(id);
        toast.success("Review deleted");
      }
    } catch {
      setReviews(prev); // rollback on failure
      toast.error("Action failed — please try again");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Patient Reviews</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Approve reviews to make them visible on the website. Patients submit reviews via WhatsApp link.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: reviews.length, color: "text-foreground" },
          { label: "Pending", value: reviews.filter(r => r.status === "pending").length, color: "text-yellow-600" },
          { label: "Published", value: approvedCount, color: "text-green-600" },
          { label: "Avg Rating", value: avgRating + " ⭐", color: "text-amber-500" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 flex-wrap">
        {(["pending", "all", "approved", "rejected"] as FilterTab[]).map((tab) => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === tab ? "bg-[#1e3a5f] text-white" : "bg-card border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">No reviews found.</div>
        )}
        {filtered.map((review) => {
          const config = STATUS_CONFIG[review.status];
          return (
            <div key={review.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-semibold text-foreground">{review.patientName}</span>
                    {review.department && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{review.department}</span>
                    )}
                    {review.ref && <span className="text-xs text-muted-foreground font-mono">{review.ref}</span>}
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.color}`}>{config.label}</span>
                  </div>
                  <StarDisplay rating={review.rating} />
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {review.createdAt?.toDate?.()?.toLocaleDateString("en-IN") || "—"}
                    {review.patientPhone && ` · ${review.patientPhone}`}
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {review.status === "pending" && (
                    <>
                      <button onClick={() => handle("approve", review.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button onClick={() => handle("reject", review.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}
                  {review.status === "approved" && (
                    <button onClick={() => handle("reject", review.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-100">
                      <XCircle className="w-3.5 h-3.5" /> Unpublish
                    </button>
                  )}
                  <button onClick={() => handle("delete", review.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground border border-border rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

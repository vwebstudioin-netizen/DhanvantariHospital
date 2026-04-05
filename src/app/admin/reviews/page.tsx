"use client";

import StarRating from "@/components/shared/StarRating";

const demoReviews = [
  { id: 1, patient: "Maria G.", doctor: "Dr. Chen", rating: 5, text: "Excellent care, very thorough.", date: "Nov 15, 2024", approved: true },
  { id: 2, patient: "James T.", doctor: "Dr. Rodriguez", rating: 5, text: "Outstanding cardiologist.", date: "Nov 10, 2024", approved: true },
  { id: 3, patient: "Linda P.", doctor: "Dr. Patel", rating: 4, text: "Good experience overall.", date: "Oct 28, 2024", approved: false },
];

export default function AdminReviews() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Manage Reviews</h1>
      <div className="space-y-4">
        {demoReviews.map((review) => (
          <div key={review.id} className="flex items-start justify-between rounded-xl border border-border bg-card p-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-foreground">{review.patient}</p>
                <span className="text-xs text-muted-foreground">→ {review.doctor}</span>
              </div>
              <StarRating rating={review.rating} />
              <p className="mt-2 text-sm text-muted-foreground">{review.text}</p>
              <p className="mt-1 text-xs text-muted-foreground">{review.date}</p>
            </div>
            <div className={`rounded-full px-3 py-1 text-xs font-medium ${review.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {review.approved ? "Approved" : "Pending"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

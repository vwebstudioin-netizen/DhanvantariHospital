"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthContext } from "@/providers/AuthProvider";
import { getPatient } from "@/lib/patients";
import { Plus, Star, MessageSquare } from "lucide-react";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-4 h-4 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  pending:  "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

export default function PortalReviews() {
  const { user } = useAuthContext();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const pat = await getPatient(user!.uid);
        const email = user!.email?.trim();
        const phone = pat?.phone?.trim();
        const name  = user!.displayName?.trim();

        const snap = await getDocs(collection(db, "reviews"));
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

        // Match by phone, email, or display name
        const mine = all.filter(r =>
          (phone && r.patientPhone === phone) ||
          (name  && r.patientName  === name)
        ).sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));

        setReviews(mine);
      } catch { /* silent */ }
      finally { setLoading(false); }
    }
    load();
  }, [user]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My Reviews</h1>
        <Link href="/portal/reviews/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] transition-colors">
          <Plus className="h-4 w-4" /> Write Review
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2].map(i => <div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse h-20" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No reviews yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Share your experience with us.</p>
          <Link href="/portal/reviews/new" className="text-sm text-primary hover:underline">Write your first review →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <Stars rating={r.rating} />
                  {r.department && <p className="text-xs text-muted-foreground mt-0.5">{r.department}</p>}
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {r.status}
                </span>
              </div>
              <p className="text-sm text-foreground">{r.comment}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {r.createdAt?.toDate?.()?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) ?? "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

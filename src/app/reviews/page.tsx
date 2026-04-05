import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";
import StarRating from "@/components/shared/StarRating";

export const metadata: Metadata = {
  title: "Patient Reviews",
  description: "Read what our patients have to say about their experience at Dhanvantari Hospital.",
};

const demoReviews = [
  { id: 1, name: "Maria G.", rating: 5, date: "2024-11-15", text: "Excellent care from Dr. Chen. She took the time to listen and explain everything thoroughly. The staff at the Main Campus was warm and welcoming.", department: "General Medicine" },
  { id: 2, name: "James T.", rating: 5, date: "2024-11-10", text: "Dr. Rodriguez is an outstanding cardiologist. His expertise and bedside manner put me at ease during a stressful time. Highly recommend!", department: "Cardiology" },
  { id: 3, name: "Linda P.", rating: 4, date: "2024-10-28", text: "Good experience at the Downtown Clinic for my dermatology appointment. The wait time was minimal and the treatment was effective.", department: "Dermatology" },
  { id: 4, name: "Robert K.", rating: 5, date: "2024-10-20", text: "The orthopedic team helped me recover from my knee surgery faster than expected. The rehabilitation program is top-notch.", department: "Orthopedics" },
  { id: 5, name: "Sarah M.", rating: 5, date: "2024-10-15", text: "Brought my daughter for a pediatric checkup with Dr. Johnson. She was so patient and wonderful with children. We love Dhanvantari Hospital!", department: "Pediatrics" },
  { id: 6, name: "David L.", rating: 4, date: "2024-10-05", text: "The mental health services here are excellent. Dr. Williams created a comfortable environment and a comprehensive treatment plan for my anxiety.", department: "Mental Health" },
];

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        title="Patient Reviews"
        subtitle="Read what our patients have to say about their care experience."
        breadcrumbs={[{ label: "Reviews" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          {/* Summary */}
          <div className="mb-10 flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-8 text-center sm:flex-row sm:text-left">
            <div className="flex flex-col items-center">
              <p className="text-5xl font-bold text-primary">4.8</p>
              <StarRating rating={4.8} />
              <p className="mt-1 text-sm text-muted-foreground">Based on 500+ reviews</p>
            </div>
            <div className="flex flex-1 flex-wrap justify-center gap-6 sm:justify-start">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm text-muted-foreground">95% recommend</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">4.9 doctor rating</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">4.7 staff rating</span>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-6">
            {demoReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.department}</p>
                  </div>
                  <div className="text-right">
                    <StarRating rating={review.rating} />
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

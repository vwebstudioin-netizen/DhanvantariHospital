import StarRating from "@/components/shared/StarRating";
import SectionHeader from "@/components/shared/SectionHeader";
import Carousel from "@/components/shared/Carousel";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Jennifer M.",
    rating: 5,
    text: "Dr. Chen has been my primary care physician for 3 years. She's thorough, listens carefully, and always takes time to explain things. The online booking system makes scheduling so easy!",
    doctor: "Dr. Sarah Chen",
  },
  {
    name: "Robert K.",
    rating: 5,
    text: "After my knee surgery, Dr. Santos and the rehab team helped me get back to running in just 4 months. Their personalized approach to physical therapy is outstanding.",
    doctor: "Dr. Maria Santos",
  },
  {
    name: "Maria L.",
    rating: 5,
    text: "The Northside location is incredibly convenient and the staff is always welcoming. Dr. Johnson is amazing with my kids — they actually look forward to their check-ups!",
    doctor: "Dr. Emily Johnson",
  },
  {
    name: "David W.",
    rating: 5,
    text: "Dr. Rodriguez detected a heart condition during my routine screening that could have been serious. His expertise and quick action literally saved my life. Can't recommend enough.",
    doctor: "Dr. Michael Rodriguez",
  },
  {
    name: "Sarah T.",
    rating: 4,
    text: "Love the Patient Portal — I can message my doctor, see my appointments, and even do telehealth visits from home. Dhanvantari Hospital has really modernized healthcare.",
    doctor: "Dr. Lisa Kim",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Patient Reviews"
          title="What Our Patients Say"
          subtitle="Real stories from real patients about their experience with Dhanvantari Hospital."
        />

        <Carousel autoplay delay={6000}>
          {testimonials.map((t, i) => (
            <div key={i} className="px-4">
              <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8 text-center">
                <Quote className="mx-auto mb-4 h-8 w-8 text-primary/30" />
                <p className="mb-4 text-lg text-foreground leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mb-2 flex justify-center">
                  <StarRating rating={t.rating} />
                </div>
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">
                  Patient of {t.doctor}
                </p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Take a virtual tour of Dhanvantari Hospital's facilities, technology, and team through our photo gallery.",
};

const categories = ["All", "Facilities", "Technology", "Team", "Events"];

const demoImages = [
  { id: 1, title: "Main Campus Lobby", category: "Facilities" },
  { id: 2, title: "State-of-the-Art MRI Suite", category: "Technology" },
  { id: 3, title: "Pediatric Wing Playroom", category: "Facilities" },
  { id: 4, title: "Our Medical Team", category: "Team" },
  { id: 5, title: "Downtown Clinic Reception", category: "Facilities" },
  { id: 6, title: "Advanced Cardiac Lab", category: "Technology" },
  { id: 7, title: "Community Health Fair 2024", category: "Events" },
  { id: 8, title: "Northside Center Exterior", category: "Facilities" },
  { id: 9, title: "Physical Therapy Gym", category: "Facilities" },
  { id: 10, title: "Annual Staff Celebration", category: "Events" },
  { id: 11, title: "Digital X-Ray System", category: "Technology" },
  { id: 12, title: "Nursing Staff Meeting", category: "Team" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        title="Photo Gallery"
        subtitle="Take a virtual tour of our facilities, technology, and team."
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          {/* Filter tabs */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={cat === "All" ? "default" : "outline"}
                className="cursor-pointer px-4 py-1.5 text-sm"
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* Gallery grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {demoImages.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted"
              >
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {img.title}
                    </p>
                    <p className="text-xs text-white/70">{img.category}</p>
                  </div>
                </div>
                {/* Placeholder */}
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  {img.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

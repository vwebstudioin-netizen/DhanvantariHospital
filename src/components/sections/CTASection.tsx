import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-primary px-4 py-16 text-white md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Ready to Take Control of Your Health?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
          Schedule your appointment online in minutes, or call us to speak with
          a member of our team. Walk-ins welcome for urgent care.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/book">
            <Button
              size="lg"
              className="gap-2 bg-white text-primary hover:bg-white/90"
            >
              <Calendar className="h-5 w-5" />
              Book Online Now
            </Button>
          </Link>
          <a href="tel:5551002000">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-white/30 text-white hover:bg-white/10"
            >
              <Phone className="h-5 w-5" />
              Call (555) 100-2000
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

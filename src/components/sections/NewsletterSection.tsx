import SectionHeader from "@/components/shared/SectionHeader";
import NewsletterForm from "@/components/shared/NewsletterForm";

export default function NewsletterSection() {
  return (
    <section className="bg-muted/30 px-4 py-16 md:py-20">
      <div className="mx-auto max-w-xl text-center">
        <SectionHeader
          badge="Stay Updated"
          title="Subscribe to Our Newsletter"
          subtitle="Get health tips, clinic news, and exclusive offers delivered straight to your inbox."
        />
        <NewsletterForm />
        <p className="mt-3 text-xs text-muted-foreground">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}

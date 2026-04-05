import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import Accordion from "@/components/shared/Accordion";
import { faqs, faqCategories } from "@/data/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Find answers to frequently asked questions about Dhanvantari Hospital's services, appointments, insurance, and more.",
};

export default function FAQPage() {
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our services, appointments, insurance, and more."
        breadcrumbs={[{ label: "FAQ" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          {faqCategories.map((category) => {
            const items = faqs
              .filter((f) => f.category === category)
              .map((f) => ({ question: f.question, answer: f.answer }));
            if (items.length === 0) return null;
            return (
              <div key={category} className="mb-10">
                <h2 className="mb-4 text-xl font-bold text-foreground">
                  {category}
                </h2>
                <Accordion items={items} />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

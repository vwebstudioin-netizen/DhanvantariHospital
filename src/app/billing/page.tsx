import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { CreditCard, Phone, FileText, HelpCircle, IndianRupee, ShieldCheck, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Billing & Payments",
  description: "Understand your bill, explore payment options, and pay online at Dhanvantari Hospital.",
};

const paymentMethods = [
  { title: "Online Payment", description: "Pay securely via UPI, credit/debit card, net banking, or wallets through Razorpay.", icon: CreditCard, href: "/billing/pay" },
  { title: "Phone Payment", description: "Call our billing department to make a payment over the phone.", icon: Phone, href: "/contact" },
  { title: "In-Person", description: "Pay at the front desk during your visit using cash, card, or UPI.", icon: IndianRupee, href: "/locations" },
];

const billingFAQs = [
  { q: "When will I receive my bill?", a: "You'll receive an itemized statement via email within 5–7 business days after your visit. You can also view statements in your patient portal." },
  { q: "What if I can't pay my full balance?", a: "We offer interest-free payment plans. Contact our billing department to set up a plan that works for your budget." },
  { q: "How do I dispute a charge?", a: "Contact our billing department at info@dhanvantarihospital.com or call 08819293445. We'll review and resolve billing inquiries within 10 business days." },
  { q: "Do you offer financial assistance?", a: "Yes, we offer a sliding-fee scale for qualifying patients based on household income. Ask our front desk or billing team for an application." },
  { q: "Does my insurance cover this visit?", a: "Coverage varies by plan. We recommend calling your insurer before your visit. Our team can also help verify coverage." },
];

export default function BillingPage() {
  return (
    <>
      <PageHero
        title="Billing & Payments"
        subtitle="We make it easy to understand and pay your healthcare bills. Multiple payment options available."
        breadcrumbs={[{ label: "Billing" }]}
      />

      {/* Payment Methods */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Payment Options</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {paymentMethods.map((method) => (
              <Link key={method.title} href={method.href}>
                <div className="h-full rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <method.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{method.title}</h3>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pay Now CTA */}
      <section className="bg-primary/5 px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <IndianRupee className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="mb-2 text-2xl font-bold text-foreground">Pay Your Bill Online</h2>
          <p className="mb-6 text-muted-foreground">
            Quick, secure online payments via Razorpay. Pay using UPI, credit/debit card, net banking, or wallets.
          </p>
          <Link href="/billing/pay">
            <Button size="lg">
              <CreditCard className="mr-2 h-4 w-4" /> Pay Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Understanding Your Bill */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Understanding Your Bill</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Itemized Statement</h3>
              </div>
              <p className="text-sm text-muted-foreground">Your statement lists every service, procedure, and supply used during your visit along with the charges and any insurance adjustments applied.</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Insurance Processing</h3>
              </div>
              <p className="text-sm text-muted-foreground">We submit claims to your insurance on your behalf. After your insurer processes the claim, you&apos;ll receive a statement for any remaining patient responsibility (copay, deductible, coinsurance).</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <Download className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Patient Portal Access</h3>
              </div>
              <p className="text-sm text-muted-foreground">View and download your billing statements anytime through the patient portal. You can also set up paperless billing notifications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            <HelpCircle className="mr-2 inline h-6 w-6" />
            Billing FAQ
          </h2>
          <div className="space-y-4">
            {billingFAQs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              Have more questions? Our billing team is happy to help.
            </p>
            <Link href="/contact">
              <Button variant="outline">
                <Phone className="mr-2 h-4 w-4" /> Contact Billing Department
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

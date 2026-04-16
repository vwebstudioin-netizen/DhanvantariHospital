import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { insurancePlans, getInsuranceByType } from "@/data/insurance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Insurance & Billing",
  description: "View insurance plans accepted by Dhanvantari Hospital. We accept most major insurance plans at our hospital.",
};

const planTypes = ["HMO", "PPO", "EPO", "POS", "Medicare", "Medicaid", "Other"] as const;

export default function InsurancePage() {
  return (
    <>
      <PageHero
        title="Insurance & Billing"
        subtitle="We accept most major insurance plans. Contact us if you don't see your plan listed."
        breadcrumbs={[{ label: "Insurance" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          {planTypes.map((type) => {
            const plans = getInsuranceByType(type);
            if (plans.length === 0) return null;

            return (
              <div key={type} className="mb-10">
                <h2 className="mb-4 text-xl font-bold text-foreground">
                  {type} Plans
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {plans.map((plan) => (
                    <div
                      key={plan.name}
                      className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">
                          {plan.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {plan.locationSlugs.length === 3
                            ? "All locations"
                            : `${plan.locationSlugs.length} location${plan.locationSlugs.length !== 1 ? "s" : ""}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* CTA */}
          <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
            <h2 className="mb-3 text-xl font-bold text-foreground">
              Don&apos;t see your plan?
            </h2>
            <p className="mb-6 text-muted-foreground">
              Contact our billing department and we&apos;ll verify your coverage.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/contact">
                <Button>Contact Billing</Button>
              </Link>
              <Button variant="outline" className="gap-2">
                <Phone className="h-4 w-4" /> 08819293445
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

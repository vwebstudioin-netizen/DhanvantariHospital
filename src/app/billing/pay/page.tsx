"use client";

import { useState, useCallback } from "react";
import Script from "next/script";
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SITE_NAME } from "@/lib/constants";

interface PaymentState {
  status: "idle" | "loading" | "success" | "error";
  message: string;
  paymentId?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

export default function BillingPayPage() {
  const [amount, setAmount] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientId, setPatientId] = useState("");
  const [description, setDescription] = useState("");
  const [payment, setPayment] = useState<PaymentState>({
    status: "idle",
    message: "",
  });
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const handlePayment = useCallback(async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount < 1) {
      setPayment({
        status: "error",
        message: "Please enter a valid amount (minimum ₹1).",
      });
      return;
    }
    if (!patientName.trim() || !patientEmail.trim()) {
      setPayment({
        status: "error",
        message: "Please enter your name and email.",
      });
      return;
    }

    setPayment({ status: "loading", message: "Creating payment order..." });

    try {
      // Step 1 — Create order on server
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          patientName: patientName.trim(),
          patientEmail: patientEmail.trim(),
          patientId: patientId.trim() || undefined,
          description: description.trim() || "Hospital bill payment",
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to create order.");
      }

      // Step 2 — Open Razorpay Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: SITE_NAME,
        description: description.trim() || "Hospital bill payment",
        order_id: orderData.orderId,
        prefill: {
          name: patientName.trim(),
          email: patientEmail.trim(),
          contact: patientPhone.trim() || undefined,
        },
        theme: { color: "#2563eb" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // Step 3 — Verify on server
          setPayment({
            status: "loading",
            message: "Verifying payment...",
          });

          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                patientName: patientName.trim(),
                patientEmail: patientEmail.trim(),
                patientId: patientId.trim() || undefined,
                amount: numAmount,
                description: description.trim() || "Hospital bill payment",
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setPayment({
                status: "success",
                message: "Payment successful! A receipt has been generated.",
                paymentId: verifyData.paymentId,
              });
            } else {
              throw new Error(
                verifyData.error || "Verification failed."
              );
            }
          } catch (err) {
            setPayment({
              status: "error",
              message:
                err instanceof Error
                  ? err.message
                  : "Payment verification failed.",
            });
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setPayment({
          status: "error",
          message:
            "Payment failed. Please try again or contact the billing department.",
        });
      });
      rzp.open();
      setPayment({ status: "idle", message: "" });
    } catch (err) {
      setPayment({
        status: "error",
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      });
    }
  }, [amount, patientName, patientEmail, patientPhone, patientId, description]);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        strategy="lazyOnload"
      />

      <PageHero
        title="Pay Your Bill"
        subtitle="Securely pay your hospital bills online using Razorpay."
        breadcrumbs={[{ label: "Billing" }, { label: "Pay" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-5">
            {/* Left — Payment Form */}
            <div className="lg:col-span-3">
              {payment.status === "success" ? (
                <Card className="p-8 text-center">
                  <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                  <h2 className="mb-2 text-2xl font-bold text-foreground">
                    Payment Successful!
                  </h2>
                  <p className="mb-4 text-muted-foreground">
                    {payment.message}
                  </p>
                  {payment.paymentId && (
                    <p className="text-sm text-muted-foreground">
                      Payment ID:{" "}
                      <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                        {payment.paymentId}
                      </code>
                    </p>
                  )}
                  <Button
                    className="mt-6"
                    onClick={() => {
                      setPayment({ status: "idle", message: "" });
                      setAmount("");
                      setDescription("");
                    }}
                  >
                    Make Another Payment
                  </Button>
                </Card>
              ) : (
                <Card className="p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">
                      Online Bill Payment
                    </h2>
                  </div>

                  <Separator className="mb-6" />

                  <div className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      {/* Patient Name */}
                      <div>
                        <Label htmlFor="patientName">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="patientName"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="John Doe"
                          disabled={payment.status === "loading"}
                        />
                      </div>

                      {/* Patient Email */}
                      <div>
                        <Label htmlFor="patientEmail">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="patientEmail"
                          type="email"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          placeholder="john@example.com"
                          disabled={payment.status === "loading"}
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      {/* Phone */}
                      <div>
                        <Label htmlFor="patientPhone">
                          Phone (optional)
                        </Label>
                        <Input
                          id="patientPhone"
                          type="tel"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          disabled={payment.status === "loading"}
                        />
                      </div>

                      {/* Patient ID */}
                      <div>
                        <Label htmlFor="patientId">
                          Patient ID (optional)
                        </Label>
                        <Input
                          id="patientId"
                          value={patientId}
                          onChange={(e) => setPatientId(e.target.value)}
                          placeholder="PT-12345"
                          disabled={payment.status === "loading"}
                        />
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <Label htmlFor="amount">
                        Amount (₹) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          min="1"
                          step="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="500.00"
                          className="pl-9"
                          disabled={payment.status === "loading"}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor="description">
                        Description (optional)
                      </Label>
                      <Input
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Consultation, Lab tests, Pharmacy, etc."
                        disabled={payment.status === "loading"}
                      />
                    </div>

                    {/* Error */}
                    {payment.status === "error" && (
                      <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        {payment.message}
                      </div>
                    )}

                    {/* Pay Button */}
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handlePayment}
                      disabled={
                        payment.status === "loading" || !razorpayLoaded
                      }
                    >
                      {payment.status === "loading" ? (
                        <>
                          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          {payment.message}
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay Securely
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Right — Info sidebar */}
            <div className="space-y-6 lg:col-span-2">
              {/* Security info */}
              <Card className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-foreground">
                    Secure Payment
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  All payments are processed securely through Razorpay with
                  256-bit SSL encryption. We never store your card details.
                </p>
              </Card>

              {/* Accepted methods */}
              <Card className="p-6">
                <h3 className="mb-3 font-semibold text-foreground">
                  Accepted Payment Methods
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Credit Card</Badge>
                  <Badge variant="secondary">Debit Card</Badge>
                  <Badge variant="secondary">UPI</Badge>
                  <Badge variant="secondary">Net Banking</Badge>
                  <Badge variant="secondary">Wallets</Badge>
                </div>
              </Card>

              {/* Help */}
              <Card className="p-6">
                <h3 className="mb-3 font-semibold text-foreground">
                  Need Help?
                </h3>
                <p className="text-sm text-muted-foreground">
                  If you have any questions about your bill or face issues
                  with the payment, please contact our billing department:
                </p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <li>📞 Call: +91 98765 43210</li>
                  <li>✉️ Email: billing@clinicarepro.com</li>
                  <li>🕘 Mon–Sat: 8:00 AM – 6:00 PM</li>
                </ul>
              </Card>

              {/* Transaction fee note */}
              <p className="text-center text-xs text-muted-foreground">
                A 2% transaction fee applies to all online payments.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterSchema, type NewsletterFormValues } from "@/lib/validations";
import { Send, CheckCircle } from "lucide-react";

export default function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  async function onSubmit(data: NewsletterFormValues) {
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to subscribe");
      setSubmitted(true);
      reset();
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-success">
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Thanks for subscribing!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <div className="flex-1">
        <Input
          placeholder="Enter your email"
          {...register("email")}
          className="h-10"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-error">{errors.email.message}</p>
        )}
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
      <Button type="submit" size="sm" disabled={isSubmitting} className="h-10 gap-1">
        <Send className="h-4 w-4" />
        Subscribe
      </Button>
    </form>
  );
}

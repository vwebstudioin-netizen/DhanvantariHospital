"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";
import { locations } from "@/data/locations";
import { Send, CheckCircle } from "lucide-react";
import Alert from "@/components/shared/Alert";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(data: ContactFormValues) {
    try {
      setError("");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setSubmitted(true);
      reset();
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <Alert
        type="success"
        title="Message Sent!"
        message="Thank you for contacting us. We'll get back to you within 24 hours."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError("")} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" placeholder="John Doe" {...register("name")} className="mt-1" />
          {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" placeholder="john@email.com" {...register("email")} className="mt-1" />
          {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="(555) 000-0000" {...register("phone")} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="locationId">Location</Label>
          <Select id="locationId" {...register("locationId")} className="mt-1">
            <option value="">Any Location</option>
            {locations.map((loc) => (
              <option key={loc.slug} value={loc.slug}>
                {loc.name.replace("Dhanvantari Hospital — ", "")}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="subject">Subject *</Label>
        <Input id="subject" placeholder="How can we help?" {...register("subject")} className="mt-1" />
        {errors.subject && <p className="mt-1 text-xs text-error">{errors.subject.message}</p>}
      </div>

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea id="message" rows={5} placeholder="Tell us more about your inquiry..." {...register("message")} className="mt-1" />
        {errors.message && <p className="mt-1 text-xs text-error">{errors.message.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="gap-2">
        <Send className="h-4 w-4" />
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

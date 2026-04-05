"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";

export default function NewMessagePage() {
  const [subject, setSubject] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div>
      <Link href="/portal/messages" className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Messages
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-foreground">New Message</h1>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">To</label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">Select a provider...</option>
              <option value="dr-chen">Dr. Sarah Chen</option>
              <option value="dr-rodriguez">Dr. Michael Rodriguez</option>
              <option value="dr-johnson">Dr. Emily Johnson</option>
              <option value="general">General Inquiry</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              placeholder="Type your message..."
            />
          </div>
          <div className="flex justify-end">
            <Button className="gap-2">
              <Send className="h-4 w-4" /> Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

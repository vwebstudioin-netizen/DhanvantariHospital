"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Mail } from "lucide-react";

const demoMessages = [
  { id: "1", subject: "Lab Results Available", from: "Dr. Chen's Office", date: "Nov 23, 2024", preview: "Your recent lab results are now available for review...", isRead: false },
  { id: "2", subject: "Appointment Reminder", from: "Dhanvantari Hospital", date: "Nov 20, 2024", preview: "This is a reminder about your upcoming appointment on Dec 15...", isRead: true },
  { id: "3", subject: "Prescription Refill Approved", from: "Pharmacy", date: "Nov 15, 2024", preview: "Your prescription refill request has been approved and is ready...", isRead: true },
  { id: "4", subject: "Follow-up Instructions", from: "Dr. Rodriguez", date: "Nov 10, 2024", preview: "Thank you for your recent visit. Please follow these post-visit...", isRead: true },
];

export default function PortalMessages() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <Link href="/portal/messages/new">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> New Message
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        {demoMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-4 rounded-xl border p-4 transition hover:border-primary/30 ${
              msg.isRead ? "border-border bg-card" : "border-primary/20 bg-primary/5"
            }`}
          >
            <Mail className={`mt-1 h-5 w-5 shrink-0 ${msg.isRead ? "text-muted-foreground" : "text-primary"}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className={`text-sm truncate ${msg.isRead ? "text-foreground" : "font-semibold text-foreground"}`}>
                  {msg.subject}
                </h3>
                {!msg.isRead && <Badge variant="default" className="shrink-0 text-xs">New</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">{msg.from} · {msg.date}</p>
              <p className="mt-1 text-sm text-muted-foreground truncate">{msg.preview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

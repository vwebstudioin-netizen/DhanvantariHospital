"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const demoMessages = [
  { id: 1, name: "Maria Garcia", email: "maria@email.com", subject: "Appointment inquiry", date: "Nov 23, 2024", status: "unread" },
  { id: 2, name: "Robert Smith", email: "robert@email.com", subject: "Insurance question", date: "Nov 22, 2024", status: "read" },
  { id: 3, name: "Jennifer Lee", email: "jennifer@email.com", subject: "Prescription refill", date: "Nov 21, 2024", status: "replied" },
];

const statusColors: Record<string, "default" | "secondary" | "outline"> = { unread: "default", read: "secondary", replied: "outline" };

export default function AdminMessages() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Messages</h1>
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search messages..." className="pl-10" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">From</th>
              <th className="px-4 py-3 text-left font-medium">Subject</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {demoMessages.map((msg) => (
              <tr key={msg.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">{msg.name}<br/><span className="text-xs text-muted-foreground">{msg.email}</span></td>
                <td className="px-4 py-3">{msg.subject}</td>
                <td className="px-4 py-3">{msg.date}</td>
                <td className="px-4 py-3"><Badge variant={statusColors[msg.status]}>{msg.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

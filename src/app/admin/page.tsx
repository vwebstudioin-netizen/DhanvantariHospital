"use client";

import {
  Calendar,
  Users,
  MessageSquare,
  Star,
  TrendingUp,
  Activity,
} from "lucide-react";

const stats = [
  { label: "Total Appointments", value: "1,247", change: "+12%", icon: Calendar },
  { label: "Active Patients", value: "3,850", change: "+5%", icon: Users },
  { label: "Pending Messages", value: "24", change: "-3%", icon: MessageSquare },
  { label: "Avg. Rating", value: "4.8", change: "+0.1", icon: Star },
];

const recentActivity = [
  { id: 1, text: "New appointment booked — John D. with Dr. Chen", time: "2 min ago" },
  { id: 2, text: "Patient review submitted (5 stars) for Dr. Rodriguez", time: "15 min ago" },
  { id: 3, text: "New contact form submission from Maria G.", time: "1 hr ago" },
  { id: 4, text: "Job application received for RN position", time: "2 hrs ago" },
  { id: 5, text: "Newsletter subscriber count reached 2,500", time: "3 hrs ago" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <stat.icon className="h-5 w-5 text-primary" />
              <span className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" /> {stat.change}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <Activity className="h-5 w-5 text-primary" /> Recent Activity
        </h2>
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <p className="text-sm text-foreground">{item.text}</p>
              <span className="shrink-0 text-xs text-muted-foreground">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

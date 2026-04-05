"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function AdminBlog() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> New Post</Button>
      </div>
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search blog posts..." className="pl-10" />
      </div>
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        <p>Blog posts would be managed here via Firestore.</p>
        <p className="mt-2 text-sm">Create, edit, publish, and manage blog content with rich text editing.</p>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminGallery() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Gallery</h1>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Upload Images</Button>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        <p>Gallery image management via Firebase Storage.</p>
        <p className="mt-2 text-sm">Upload, organize, and manage photos for the public gallery.</p>
      </div>
    </div>
  );
}

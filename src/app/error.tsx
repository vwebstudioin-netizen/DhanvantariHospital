"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          Something went wrong
        </h1>
        <p className="mb-6 text-muted-foreground">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset}>Try Again</Button>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

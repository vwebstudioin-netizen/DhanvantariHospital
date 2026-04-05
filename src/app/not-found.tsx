import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <FileQuestion className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 text-4xl font-bold text-foreground">404</h1>
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          Page Not Found
        </h2>
        <p className="mb-6 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
  children?: React.ReactNode;
}

export default function PageHero({
  title,
  subtitle,
  breadcrumbs,
  className,
  children,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative bg-linear-to-br from-primary/5 via-background to-primary/5 px-4 py-16 md:py-20",
        className
      )}
    >
      <div className="mx-auto max-w-7xl">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-primary">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

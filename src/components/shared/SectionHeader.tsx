import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(centered && "text-center", "mb-10", className)}>
      {badge && (
        <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {badge}
        </span>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}

import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

function Avatar({
  className,
  src,
  alt,
  fallback,
  size = "md",
  ...props
}: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-lg",
  };

  if (src) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-full",
          sizes[size],
          className
        )}
        {...props}
      >
        <img
          src={src}
          alt={alt || "Avatar"}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary/10 font-medium text-primary",
        sizes[size],
        className
      )}
      {...props}
    >
      {fallback ? getInitials(fallback) : "?"}
    </div>
  );
}

export { Avatar };

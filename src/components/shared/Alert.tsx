"use client";

import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export default function Alert({
  type = "info",
  title,
  message,
  onClose,
  className,
}: AlertProps) {
  const styles = {
    info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
    success: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
    error: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
  };

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4",
        styles[type],
        className
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1">
        {title && <p className="font-medium">{title}</p>}
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="shrink-0 opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

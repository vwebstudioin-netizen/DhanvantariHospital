"use client";

import { cn } from "@/lib/utils";

interface AnnouncementBarProps {
  text: string;
  link?: string;
  onClose?: () => void;
}

export default function AnnouncementBar({
  text,
  link,
  onClose,
}: AnnouncementBarProps) {
  return (
    <div className="relative bg-primary px-4 py-2 text-center text-sm text-white">
      {link ? (
        <a href={link} className="underline underline-offset-2 hover:opacity-90">
          {text}
        </a>
      ) : (
        <span>{text}</span>
      )}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
          aria-label="Close announcement"
        >
          ✕
        </button>
      )}
    </div>
  );
}

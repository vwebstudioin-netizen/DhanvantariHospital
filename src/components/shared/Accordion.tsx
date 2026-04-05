"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export default function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-card"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-muted/50 rounded-lg transition-colors"
          >
            {item.question}
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                openIndex === i && "rotate-180"
              )}
            />
          </button>
          {openIndex === i && (
            <div className="px-4 pb-3 text-sm text-muted-foreground leading-relaxed">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

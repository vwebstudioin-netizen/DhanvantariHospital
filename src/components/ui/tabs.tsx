"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

import { createContext, useContext } from "react";

const TabsContext = createContext<{
  value: string;
  setValue: (v: string) => void;
}>({ value: "", setValue: () => {} });

function Tabs({ defaultValue, children, className }: TabsProps) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-muted p-1",
        className
      )}
    >
      {children}
    </div>
  );
}

function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { value: current, setValue } = useContext(TabsContext);
  return (
    <button
      onClick={() => setValue(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        current === value
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children, className }: TabsContentProps) {
  const { value: current } = useContext(TabsContext);
  if (current !== value) return null;
  return <div className={cn("mt-2", className)}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };

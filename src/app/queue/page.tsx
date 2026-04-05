"use client";

import { useState } from "react";
import { useQueue } from "@/hooks/useQueue";
import { Search, Clock, Hash, User } from "lucide-react";
import { SITE_NAME, CONTACT_PHONE } from "@/lib/constants";
import type { Token } from "@/types/token";

export default function QueueCheckPage() {
  const { tokens, waitingTokens, currentServing } = useQueue();
  const [searchValue, setSearchValue] = useState("");
  const [foundToken, setFoundToken] = useState<Token | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    const val = searchValue.trim();

    // Search by token number or phone
    const found = tokens.find(
      (t) =>
        t.displayNumber === val.padStart(3, "0") ||
        t.tokenNumber === parseInt(val) ||
        t.patientPhone === val ||
        t.patientPhone.endsWith(val)
    );

    setFoundToken(found || null);
    setSearched(true);
  };

  const getPosition = (token: Token) => {
    if (token.status === "serving") return 0;
    if (token.status !== "waiting") return -1;
    const idx = waitingTokens.findIndex((t) => t.id === token.id);
    return idx + 1;
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">{SITE_NAME}</h1>
        <p className="text-muted-foreground">Check Your Queue Position</p>
      </div>

      {/* Current Serving Display */}
      <div className="mb-8 rounded-2xl border-2 border-primary bg-primary/5 p-6 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          Now Serving
        </p>
        <p className="my-1 text-5xl font-bold text-primary">
          {currentServing ? `#${currentServing.displayNumber}` : "---"}
        </p>
        <p className="text-sm text-muted-foreground">
          {waitingTokens.length} patient{waitingTokens.length !== 1 ? "s" : ""}{" "}
          waiting
        </p>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Find Your Token
        </h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Enter your token number or phone number
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Token # or Phone"
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSearch}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-[#152d4a]"
          >
            Search
          </button>
        </div>

        {/* Result */}
        {searched && (
          <div className="mt-4">
            {foundToken ? (
              <div className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    {foundToken.displayNumber}
                  </div>
                  <div>
                    <p className="font-semibold flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {foundToken.patientName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {foundToken.purpose}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-3">
                  {foundToken.status === "serving" ? (
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">
                        It&apos;s Your Turn!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Please proceed to the doctor&apos;s room
                      </p>
                    </div>
                  ) : foundToken.status === "waiting" ? (
                    <div className="text-center">
                      <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <Hash className="h-4 w-4" /> Position in Queue
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {getPosition(foundToken)}
                      </p>
                      <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
                        <Clock className="h-4 w-4" />
                        Est. wait: ~{getPosition(foundToken) * 10} min
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm font-medium capitalize">
                        Status:{" "}
                        <span
                          className={
                            foundToken.status === "completed"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {foundToken.status}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-950">
                <p className="text-sm text-red-600 dark:text-red-400">
                  No active token found. Please check your token number or phone.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contact */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Need help? Call us at{" "}
        <a href={`tel:${CONTACT_PHONE}`} className="text-primary hover:underline">
          {CONTACT_PHONE}
        </a>
      </p>
    </div>
  );
}

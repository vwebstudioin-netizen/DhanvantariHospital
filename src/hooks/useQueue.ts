"use client";

import { useEffect, useState, useCallback } from "react";
import type { Token, QueueConfig } from "@/types/token";
import {
  getTodayDateKey, subscribeToConfig, subscribeToTokens,
  issueToken as issueTokenFn,
  callNextToken as callNextFn,
  startConsultation as startFn,
  completeToken as completeFn,
  skipToken as skipFn,
  markNoShow as markNoShowFn,
  ensureQueueConfig,
} from "@/lib/queue";

export function useQueue(date?: string) {
  const dateKey = date || getTodayDateKey();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [config, setConfig] = useState<QueueConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ensureQueueConfig(dateKey);

    const unsubConfig = subscribeToConfig(dateKey, (cfg) => {
      setConfig(cfg);
      setLoading(false);
    });

    const unsubTokens = subscribeToTokens(dateKey, (tks) => {
      setTokens(tks);
    });

    return () => { unsubConfig(); unsubTokens(); };
  }, [dateKey]);

  const waitingTokens = tokens.filter((t) => t.status === "waiting");

  // calledToken — summoned but not yet started
  const calledToken = tokens.find((t) => t.status === "called") || null;

  // servingToken — consultation in progress
  const servingToken = tokens.find((t) => t.status === "serving") || null;

  // activeToken — whichever is currently active (called or serving)
  const activeToken = calledToken || servingToken || null;

  const completedTokens = tokens.filter(
    (t) => t.status === "completed" || t.status === "skipped" || t.status === "no-show"
  );

  const issueToken = useCallback(async (name: string, phone: string, purpose?: string) => {
    return issueTokenFn(name, phone, purpose);
  }, []);

  const callNext = useCallback(async () => {
    return callNextFn(dateKey);
  }, [dateKey]);

  const startConsultation = useCallback(async (tokenId: string) => {
    return startFn(dateKey, tokenId);
  }, [dateKey]);

  const complete = useCallback(async (tokenId: string) => {
    return completeFn(dateKey, tokenId);
  }, [dateKey]);

  const skip = useCallback(async (tokenId: string) => {
    return skipFn(dateKey, tokenId);
  }, [dateKey]);

  const noShow = useCallback(async (tokenId: string) => {
    return markNoShowFn(dateKey, tokenId);
  }, [dateKey]);

  return {
    tokens,
    waitingTokens,
    calledToken,
    servingToken,
    activeToken,
    completedTokens,
    config,
    loading,
    issueToken,
    callNext,
    startConsultation,
    complete,
    skip,
    noShow,
  };
}

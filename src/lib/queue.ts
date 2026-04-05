import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  runTransaction,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { format } from "date-fns";
import type { Token, QueueConfig } from "@/types/token";

export function getTodayDateKey(): string {
  return format(new Date(), "yyyy-MM-dd");
}

function configRef(date: string) {
  return doc(db, "queue", date, "config", "settings");
}

function tokensCol(date: string) {
  return collection(db, "queue", date, "tokens");
}

export async function getQueueConfig(date: string): Promise<QueueConfig | null> {
  const snap = await getDoc(configRef(date));
  return snap.exists() ? (snap.data() as QueueConfig) : null;
}

export async function ensureQueueConfig(date: string): Promise<QueueConfig> {
  const existing = await getQueueConfig(date);
  if (existing) return existing;
  const config: Omit<QueueConfig, "updatedAt"> & { updatedAt: ReturnType<typeof serverTimestamp> } = {
    date,
    lastTokenNumber: 0,
    currentServingToken: 0,
    isQueueActive: true,
    updatedAt: serverTimestamp(),
  };
  await setDoc(configRef(date), config);
  return { ...config, updatedAt: null as unknown as QueueConfig["updatedAt"] } as QueueConfig;
}

export async function issueToken(
  patientName: string,
  patientPhone: string,
  purpose?: string
): Promise<Token> {
  const date = getTodayDateKey();

  const newToken = await runTransaction(db, async (transaction) => {
    const cfgRef = configRef(date);
    const cfgSnap = await transaction.get(cfgRef);

    let lastNum = 0;
    if (cfgSnap.exists()) {
      lastNum = cfgSnap.data().lastTokenNumber || 0;
    }

    const nextNum = lastNum + 1;
    const displayNumber = String(nextNum).padStart(3, "0");

    const tokenData = {
      tokenNumber: nextNum,
      displayNumber,
      patientName,
      patientPhone,
      purpose: purpose || "",
      status: "waiting" as const,
      issuedAt: serverTimestamp(),
    };

    const tokenRef = doc(tokensCol(date));
    transaction.set(tokenRef, tokenData);

    transaction.set(
      cfgRef,
      {
        date,
        lastTokenNumber: nextNum,
        isQueueActive: true,
        updatedAt: serverTimestamp(),
        ...(cfgSnap.exists() ? {} : { currentServingToken: 0 }),
      },
      { merge: true }
    );

    return { id: tokenRef.id, ...tokenData } as unknown as Token;
  });

  return newToken;
}

export async function callNextToken(date: string): Promise<Token | null> {
  const q = query(
    tokensCol(date),
    where("status", "==", "waiting"),
    orderBy("tokenNumber", "asc"),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;

  const tokenDoc = snap.docs[0];
  const tokenData = tokenDoc.data() as Omit<Token, "id">;

  await updateDoc(doc(tokensCol(date), tokenDoc.id), {
    status: "serving",
    calledAt: serverTimestamp(),
  });

  await setDoc(
    configRef(date),
    {
      currentServingToken: tokenData.tokenNumber,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return { id: tokenDoc.id, ...tokenData, status: "serving" } as Token;
}

export async function completeToken(date: string, tokenId: string): Promise<void> {
  await updateDoc(doc(tokensCol(date), tokenId), {
    status: "completed",
    completedAt: serverTimestamp(),
  });
}

export async function skipToken(date: string, tokenId: string): Promise<void> {
  await updateDoc(doc(tokensCol(date), tokenId), {
    status: "skipped",
    completedAt: serverTimestamp(),
  });
}

export async function markNoShow(date: string, tokenId: string): Promise<void> {
  await updateDoc(doc(tokensCol(date), tokenId), {
    status: "no-show",
    completedAt: serverTimestamp(),
  });
}

export async function getTokens(date: string): Promise<Token[]> {
  const q = query(tokensCol(date), orderBy("tokenNumber", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Token);
}

export async function getWaitingTokens(date: string): Promise<Token[]> {
  const q = query(
    tokensCol(date),
    where("status", "==", "waiting"),
    orderBy("tokenNumber", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Token);
}

export async function getCurrentServing(date: string): Promise<Token | null> {
  const q = query(
    tokensCol(date),
    where("status", "==", "serving"),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Token;
}

export async function getTokenByPhone(date: string, phone: string): Promise<Token | null> {
  const q = query(
    tokensCol(date),
    where("patientPhone", "==", phone),
    where("status", "in", ["waiting", "serving"]),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Token;
}

// Real-time listeners
export function subscribeToConfig(
  date: string,
  callback: (config: QueueConfig | null) => void
): Unsubscribe {
  return onSnapshot(configRef(date), (snap) => {
    callback(snap.exists() ? (snap.data() as QueueConfig) : null);
  });
}

export function subscribeToTokens(
  date: string,
  callback: (tokens: Token[]) => void
): Unsubscribe {
  const q = query(tokensCol(date), orderBy("tokenNumber", "asc"));
  return onSnapshot(q, (snap) => {
    const tokens = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Token);
    callback(tokens);
  });
}

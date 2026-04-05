import { Timestamp } from "firebase/firestore";

export type TokenStatus = "waiting" | "serving" | "completed" | "skipped" | "no-show";

export interface Token {
  id: string;
  tokenNumber: number;
  displayNumber: string;
  patientName: string;
  patientPhone: string;
  purpose?: string;
  status: TokenStatus;
  issuedAt: Timestamp;
  calledAt?: Timestamp;
  completedAt?: Timestamp;
  notes?: string;
}

export interface QueueConfig {
  date: string;
  lastTokenNumber: number;
  currentServingToken: number;
  isQueueActive: boolean;
  startTime?: string;
  endTime?: string;
  updatedAt: Timestamp;
}

export interface DailyQueueStats {
  date: string;
  totalTokensIssued: number;
  totalServed: number;
  totalSkipped: number;
  totalNoShow: number;
  avgWaitTimeMinutes?: number;
}

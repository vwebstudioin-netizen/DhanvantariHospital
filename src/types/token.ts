import { Timestamp } from "firebase/firestore";

export type TokenStatus =
  | "waiting"    // In the queue, not yet called
  | "called"     // Called out — patient is being summoned (WhatsApp sent)
  | "serving"    // Consultation in progress
  | "completed"  // Consultation done
  | "skipped"    // Patient not present when called — moved back or skipped
  | "no-show";   // Patient absent, marked done without consultation

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
  startedAt?: Timestamp;
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

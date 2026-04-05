import type { Timestamp } from "firebase/firestore";

export type WishStatus = "draft" | "sent" | "failed";

export interface WishCampaign {
  id: string;
  occasion: string;
  message: string;           // may contain {name} placeholder
  sentAt?: Timestamp;
  recipientCount: number;
  successCount?: number;
  status: WishStatus;
  createdBy: string;
  createdAt: Timestamp;
}

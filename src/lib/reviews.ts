import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Review {
  id: string;
  patientName: string;
  patientPhone?: string;
  department?: string;
  rating: number;          // 1-5
  comment: string;
  status: "pending" | "approved" | "rejected";
  ref?: string;            // invoice or card number for traceability
  createdAt: Timestamp;
  approvedAt?: Timestamp;
}

const COL = "reviews";

export async function submitReview(
  data: Omit<Review, "id" | "status" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    status: "pending",
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function getApprovedReviews(): Promise<Review[]> {
  const q = query(
    collection(db, COL),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Review[];
}

export async function getAllReviews(): Promise<Review[]> {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Review[];
}

export async function approveReview(id: string): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    status: "approved",
    approvedAt: Timestamp.now(),
  });
}

export async function rejectReview(id: string): Promise<void> {
  await updateDoc(doc(db, COL, id), { status: "rejected" });
}

export async function deleteReview(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

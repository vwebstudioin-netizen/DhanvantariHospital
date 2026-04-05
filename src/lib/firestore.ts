import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
  type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

// Collection references
export const doctorsCol = collection(db, "doctors");
export const departmentsCol = collection(db, "departments");
export const servicesCol = collection(db, "services");
export const locationsCol = collection(db, "locations");
export const appointmentsCol = collection(db, "appointments");
export const patientsCol = collection(db, "patients");
export const contactMessagesCol = collection(db, "contactMessages");
export const blogPostsCol = collection(db, "blogPosts");
export const newsCol = collection(db, "news");
export const reviewsCol = collection(db, "reviews");
export const siteSettingsCol = collection(db, "siteSettings");
export const jobsCol = collection(db, "jobs");
export const jobApplicationsCol = collection(db, "jobApplications");
export const insurancePlansCol = collection(db, "insurancePlans");
export const galleryCol = collection(db, "gallery");
export const newslettersCol = collection(db, "newsletters");

// Generic helpers
export async function getDocument<T>(
  collectionName: string,
  docId: string
): Promise<(T & { id: string }) | null> {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
}

export async function getDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<(T & { id: string })[]> {
  const colRef = collection(db, collectionName);
  const q = query(colRef, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T & { id: string });
}

export async function addDocument(
  collectionName: string,
  data: DocumentData
): Promise<string> {
  const colRef = collection(db, collectionName);
  const docRef = await addDoc(colRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}

// Paginated query helper
export async function getPaginatedDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[],
  pageSize: number,
  lastDoc?: DocumentSnapshot
): Promise<{ items: (T & { id: string })[]; lastDoc: DocumentSnapshot | null }> {
  const colRef = collection(db, collectionName);
  const paginationConstraints: QueryConstraint[] = [
    ...constraints,
    limit(pageSize),
  ];
  if (lastDoc) {
    paginationConstraints.push(startAfter(lastDoc));
  }
  const q = query(colRef, ...paginationConstraints);
  const snap = await getDocs(q);
  const items = snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as T & { id: string }
  );
  const last = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;
  return { items, lastDoc: last };
}

// Re-exports for convenience
export {
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
};

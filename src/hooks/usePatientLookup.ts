import { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface PatientMatch {
  name: string;
  phone: string;
  bloodGroup?: string;
  email?: string;
  address?: string;
  /** Filled only when looked up via PAT-XXXX card ID */
  doctorName?: string;
}

/**
 * Auto-lookup patient by phone number (10 digits) or inpatient card patient ID (PAT-XXXX).
 * Debounces 500 ms. Returns null while loading or no match found.
 */
export function usePatientLookup(phone: string, patientId?: string): {
  match: PatientMatch | null;
  loading: boolean;
} {
  const [match, setMatch] = useState<PatientMatch | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  // Track mount state to avoid setState after unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (mountedRef.current) setMatch(null);

    const cleanPhone = phone.trim().replace(/\D/g, "");
    const cleanId    = patientId?.trim().toUpperCase() ?? "";

    const shouldLookupPhone = cleanPhone.length === 10;
    const shouldLookupId    = /^PAT-\d+$/i.test(cleanId);

    if (!shouldLookupPhone && !shouldLookupId) return;

    if (mountedRef.current) setLoading(true);

    timerRef.current = setTimeout(async () => {
      try {
        if (shouldLookupId) {
          const snap = await getDocs(
            query(collection(db, "inpatientCards"), where("patientId", "==", cleanId), limit(1))
          );
          if (!mountedRef.current) return;
          if (!snap.empty) {
            const d = snap.docs[0].data();
            setMatch({ name: d.patientName ?? "", phone: d.patientPhone ?? "", doctorName: d.doctorName ?? "" });
            return;
          }
        }

        if (shouldLookupPhone) {
          const snap = await getDocs(
            query(collection(db, "patients"), where("phone", "==", cleanPhone), limit(1))
          );
          if (!mountedRef.current) return;
          if (!snap.empty) {
            const d = snap.docs[0].data();
            setMatch({ name: d.name ?? "", phone: cleanPhone, bloodGroup: d.bloodGroup, email: d.email, address: d.address });
          }
        }
      } catch {
        // silent — autofill is best-effort
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }, 500);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phone, patientId]);

  return { match, loading };
}

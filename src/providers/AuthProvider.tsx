"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthChange } from "@/lib/auth";
import type { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isPharmacist: boolean;
  isReceptionist: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isPharmacist: false,
  isReceptionist: false,
  isStaff: false,
});

export function useAuthContext() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPharmacist, setIsPharmacist] = useState(false);
  const [isReceptionist, setIsReceptionist] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const result = await firebaseUser.getIdTokenResult();
        const admin = result.claims.admin === true;
        const pharmacist = result.claims.pharmacist === true;
        const receptionist = result.claims.receptionist === true;
        setIsAdmin(admin);
        setIsPharmacist(pharmacist);
        setIsReceptionist(receptionist);
        setIsStaff(admin || pharmacist || receptionist);
      } else {
        setIsAdmin(false);
        setIsPharmacist(false);
        setIsReceptionist(false);
        setIsStaff(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, isPharmacist, isReceptionist, isStaff }}
    >
      {children}
    </AuthContext.Provider>
  );
}

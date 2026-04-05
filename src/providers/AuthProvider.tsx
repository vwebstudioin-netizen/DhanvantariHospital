"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthChange } from "@/lib/auth";
import { getUserRole, type UserRole } from "@/lib/userRoles";
import type { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: UserRole | null;
  isAdmin: boolean;
  isPharmacist: boolean;
  isReceptionist: boolean;
  isDoctor: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  isAdmin: false,
  isPharmacist: false,
  isReceptionist: false,
  isDoctor: false,
  isStaff: false,
});

export function useAuthContext() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const r = await getUserRole(firebaseUser.uid);
          setRole(r);
        } catch {
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = role === "admin";
  const isPharmacist = role === "pharmacist";
  const isReceptionist = role === "receptionist";
  const isDoctor = role === "doctor";
  const isStaff = isAdmin || isPharmacist || isReceptionist || isDoctor;

  return (
    <AuthContext.Provider
      value={{ user, loading, role, isAdmin, isPharmacist, isReceptionist, isDoctor, isStaff }}
    >
      {children}
    </AuthContext.Provider>
  );
}

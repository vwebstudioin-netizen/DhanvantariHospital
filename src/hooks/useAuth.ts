"use client";

import { useAuthContext } from "@/providers/AuthProvider";
import { signIn, signUp, signOut } from "@/lib/auth";

export function useAuth() {
  const { user, loading, role, isAdmin, isPharmacist, isReceptionist, isDoctor, isStaff } =
    useAuthContext();

  return {
    user,
    loading,
    role,
    isAdmin,
    isPharmacist,
    isReceptionist,
    isDoctor,
    isStaff,
    signIn,
    signUp,
    signOut,
  };
}

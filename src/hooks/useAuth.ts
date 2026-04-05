"use client";

import { useAuthContext } from "@/providers/AuthProvider";
import { signIn, signUp, signOut } from "@/lib/auth";

export function useAuth() {
  const { user, loading, isAdmin, isPharmacist, isReceptionist, isStaff } =
    useAuthContext();

  return {
    user,
    loading,
    isAdmin,
    isPharmacist,
    isReceptionist,
    isStaff,
    signIn,
    signUp,
    signOut,
  };
}

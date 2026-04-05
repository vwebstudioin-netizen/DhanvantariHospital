"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { upsertPatientFromGoogle } from "@/lib/patients";
import { SITE_NAME } from "@/lib/constants";
import { Hospital } from "lucide-react";
import toast from "react-hot-toast";

const googleProvider = new GoogleAuthProvider();

export default function PortalLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Save / update patient record in Firestore
      await upsertPatientFromGoogle(result.user);
      toast.success(`Welcome, ${result.user.displayName?.split(" ")[0] || "Patient"}!`);
      router.push("/portal");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        toast.error("Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          {/* Logo */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Hospital className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{SITE_NAME}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Patient Portal</p>

          <div className="my-8">
            <p className="text-sm text-muted-foreground mb-6">
              Sign in with your Google account to access your health records, appointments, and more.
            </p>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-lg border border-border bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {loading ? "Signing in..." : "Continue with Google"}
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-primary hover:underline">Terms</a>
            {" "}and{" "}
            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
            Your Google profile will be saved as your patient record.
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Staff login?{" "}
          <a href="/login" className="text-primary hover:underline">Staff sign in here</a>
        </p>
      </div>
    </div>
  );
}

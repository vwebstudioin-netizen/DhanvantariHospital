"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { SITE_NAME } from "@/lib/constants";
import { Hospital } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const result = await credential.user.getIdTokenResult();
      const claims = result.claims;

      if (claims.admin) {
        router.push("/admin");
      } else if (claims.pharmacist) {
        router.push("/admin/pharmacy");
      } else if (claims.receptionist) {
        router.push("/desk");
      } else if (claims.patient) {
        router.push("/portal");
      } else {
        // No role assigned yet
        toast.error("Your account has no role assigned. Contact admin.");
        await auth.signOut();
      }
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Hospital className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{SITE_NAME}</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              placeholder="you@dhanvantarihospital.com"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Patient portal?{" "}
          <a href="/portal/login" className="text-primary hover:underline">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}

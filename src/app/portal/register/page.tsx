"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function PortalRegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setLoading(true);
    // Demo: In production, call Firebase Auth createUserWithEmailAndPassword + create Firestore patient doc
    setTimeout(() => {
      setLoading(false);
      alert("Demo: Firebase Auth registration would happen here.");
    }, 1000);
  }

  const passwordRequirements = [
    { label: "At least 8 characters", met: form.password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(form.password) },
    { label: "One number", met: /\d/.test(form.password) },
  ];

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create an Account</h1>
            <p className="text-sm text-muted-foreground">Register to access the patient portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="First name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required className="pl-9" />
                </div>
              </div>
              <div>
                <Label>Last Name</Label>
                <Input placeholder="Last name" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required />
              </div>
            </div>

            <div>
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} required className="pl-9" />
              </div>
            </div>

            <div>
              <Label>Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => update("phone", e.target.value)} required className="pl-9" />
              </div>
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  required
                  className="pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {passwordRequirements.map((req) => (
                  <div key={req.label} className="flex items-center gap-2 text-xs">
                    <CheckCircle className={`h-3 w-3 ${req.met ? "text-green-500" : "text-muted-foreground"}`} />
                    <span className={req.met ? "text-green-600" : "text-muted-foreground"}>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  required
                  className="pl-9"
                />
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            <label className="flex items-start gap-2">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 rounded border-border" />
              <span className="text-xs text-muted-foreground">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </span>
            </label>

            <Button type="submit" className="w-full" disabled={loading || !agreed}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/portal/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

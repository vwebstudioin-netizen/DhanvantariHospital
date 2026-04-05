"use client";

import { useState } from "react";
import { Shield, UserCheck, Search } from "lucide-react";
import { getIdToken } from "@/lib/auth";
import toast from "react-hot-toast";

type Role = "admin" | "pharmacist" | "receptionist" | "doctor" | "patient";

const ROLES: { value: Role; label: string; desc: string; color: string }[] = [
  { value: "admin", label: "Admin", desc: "Full access — all admin features, user management, settings", color: "bg-purple-100 text-purple-700" },
  { value: "pharmacist", label: "Pharmacist", desc: "Access to pharmacy module only — medicines, stock, suppliers, reports", color: "bg-blue-100 text-blue-700" },
  { value: "receptionist", label: "Receptionist", desc: "Access to desk (in-patient cards, billing, invoices) and token queue", color: "bg-green-100 text-green-700" },
  { value: "doctor", label: "Doctor", desc: "Access to doctor-facing queue view and appointment management", color: "bg-amber-100 text-amber-700" },
  { value: "patient", label: "Patient", desc: "Access to patient portal only", color: "bg-gray-100 text-gray-700" },
];

export default function AdminRoles() {
  const [uid, setUid] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("receptionist");
  const [loading, setLoading] = useState(false);
  const [lastAssigned, setLastAssigned] = useState<{ email: string; role: string } | null>(null);

  const handleAssignRole = async () => {
    if (!uid.trim()) {
      toast.error("Enter a user UID or email");
      return;
    }
    setLoading(true);
    try {
      const token = await getIdToken();
      const res = await fetch("/api/admin/set-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid: uid.trim(), role: selectedRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setLastAssigned({ email: data.email, role: selectedRole });
      toast.success(`Role "${selectedRole}" assigned to ${data.email}`);
      setUid("");
    } catch (err: any) {
      toast.error(err.message || "Failed to assign role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Roles</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Assign roles to staff members. Roles control what each person can access after login.
        </p>
      </div>

      {/* Assign role */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <UserCheck className="w-4 h-4" />
          Assign Role to User
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">User UID</label>
            <input
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="Firebase User UID"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Find UID in Firebase Console → Authentication → Users
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleAssignRole}
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          <Shield className="w-4 h-4" />
          {loading ? "Assigning..." : "Assign Role"}
        </button>

        {lastAssigned && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
            ✓ Role <strong>{lastAssigned.role}</strong> assigned to <strong>{lastAssigned.email}</strong>.
            User must log out and back in for the change to take effect.
          </div>
        )}
      </div>

      {/* Role descriptions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Role Access Summary</h2>
        <div className="space-y-3">
          {ROLES.map((role) => (
            <div key={role.value} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full shrink-0 ${role.color}`}>
                {role.label}
              </span>
              <p className="text-sm text-muted-foreground">{role.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
        <strong>Note:</strong> After assigning a role, the user must sign out and sign back in for the new role to take effect. Firebase custom claims are cached in the ID token.
      </div>
    </div>
  );
}

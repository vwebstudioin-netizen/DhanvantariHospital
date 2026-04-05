"use client";

import { useState } from "react";
import { Shield, UserCheck, UserPlus } from "lucide-react";
import { auth } from "@/lib/firebase";
import { setUserRole } from "@/lib/userRoles";
import toast from "react-hot-toast";

type Role = "admin" | "pharmacist" | "receptionist" | "doctor" | "patient";

const ROLES: { value: Role; label: string; desc: string; color: string }[] = [
  { value: "admin", label: "Admin", desc: "Full access — all modules, user management, settings", color: "bg-purple-100 text-purple-700" },
  { value: "pharmacist", label: "Pharmacist", desc: "Pharmacy only — medicines, stock, suppliers, reports", color: "bg-blue-100 text-blue-700" },
  { value: "receptionist", label: "Receptionist", desc: "Desk panel — in-patient cards, billing, invoices, token queue", color: "bg-green-100 text-green-700" },
  { value: "doctor", label: "Doctor", desc: "Doctor queue view and appointment management", color: "bg-amber-100 text-amber-700" },
  { value: "patient", label: "Patient", desc: "Patient portal access only", color: "bg-gray-100 text-gray-700" },
];

export default function AdminRoles() {
  const [createForm, setCreateForm] = useState({ email: "", password: "", displayName: "", role: "receptionist" as Role });
  const [creating, setCreating] = useState(false);
  const [lastCreated, setLastCreated] = useState<{ email: string; role: string } | null>(null);

  const [uid, setUid] = useState("");
  const [uidEmail, setUidEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("receptionist");
  const [assigning, setAssigning] = useState(false);
  const [lastAssigned, setLastAssigned] = useState<{ email: string; role: string } | null>(null);

  const callerUid = auth.currentUser?.uid;

  const handleCreateUser = async () => {
    if (!createForm.email || !createForm.password) { toast.error("Email and password are required"); return; }
    if (createForm.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setCreating(true);
    try {
      // Step 1: Create Firebase Auth user via REST API
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callerUid, ...createForm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      // Step 2: Write role to Firestore directly from client (authenticated)
      await setUserRole(data.uid, createForm.role, data.email, createForm.displayName);

      setLastCreated({ email: data.email, role: createForm.role });
      toast.success(`User ${data.email} created with role "${createForm.role}"`);
      setCreateForm({ email: "", password: "", displayName: "", role: "receptionist" });
    } catch (err: any) {
      toast.error(err.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const handleAssignRole = async () => {
    if (!uid.trim()) { toast.error("Enter a user UID"); return; }
    setAssigning(true);
    try {
      // Write directly from client — admin is authenticated so Firestore allows it
      await setUserRole(uid.trim(), selectedRole, uidEmail || uid);
      setLastAssigned({ email: uidEmail || uid, role: selectedRole });
      toast.success(`Role "${selectedRole}" assigned`);
      setUid(""); setUidEmail("");
    } catch (err: any) {
      toast.error(err.message || "Failed to assign role");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create staff accounts and assign roles. Staff log in via <strong>/login</strong>.
        </p>
      </div>

      {/* Create new user */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-primary" />
          Create New Staff Account
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: "email", label: "Email *", placeholder: "staff@dhanvantarihospital.com", type: "email" },
            { key: "password", label: "Password *", placeholder: "Min 6 characters", type: "password" },
            { key: "displayName", label: "Display Name", placeholder: "Staff member name (optional)", type: "text" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
              <input
                type={f.type}
                value={(createForm as any)[f.key]}
                onChange={(e) => setCreateForm({ ...createForm, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Role *</label>
            <select
              value={createForm.role}
              onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as Role })}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {ROLES.filter(r => r.value !== "patient").map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={handleCreateUser} disabled={creating}
          className="flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] transition-colors disabled:opacity-50">
          <UserPlus className="w-4 h-4" />
          {creating ? "Creating..." : "Create Account"}
        </button>
        {lastCreated && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
            ✓ Created <strong>{lastCreated.email}</strong> as <strong>{lastCreated.role}</strong>. Share the credentials with the staff member.
          </div>
        )}
      </div>

      {/* Assign role to existing user */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-primary" />
          Change Role of Existing User
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">User UID *</label>
            <input value={uid} onChange={(e) => setUid(e.target.value)} placeholder="Firebase User UID"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <p className="text-xs text-muted-foreground mt-1">Firebase Console → Authentication → Users</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email (for record)</label>
            <input value={uidEmail} onChange={(e) => setUidEmail(e.target.value)} placeholder="user@email.com"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">New Role *</label>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleAssignRole} disabled={assigning}
          className="flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] transition-colors disabled:opacity-50">
          <Shield className="w-4 h-4" />
          {assigning ? "Updating..." : "Update Role"}
        </button>
        {lastAssigned && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
            ✓ Role <strong>{lastAssigned.role}</strong> assigned to <strong>{lastAssigned.email}</strong>.
          </div>
        )}
      </div>

      {/* Role descriptions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Role Access Summary</h2>
        <div className="space-y-3">
          {ROLES.map((role) => (
            <div key={role.value} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full shrink-0 ${role.color}`}>{role.label}</span>
              <p className="text-sm text-muted-foreground">{role.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
        <strong>Note:</strong> Role changes take effect immediately on next login. All staff use <strong>/login</strong>.
      </div>
    </div>
  );
}

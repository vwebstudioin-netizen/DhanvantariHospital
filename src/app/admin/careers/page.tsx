"use client";

import { useState, useEffect } from "react";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search, Briefcase, MapPin, IndianRupee, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  isActive: boolean;
  createdAt?: any;
}

const EMPTY_FORM: Omit<JobOpening, "id" | "createdAt"> = {
  title: "", department: "", location: "Tanuku, AP",
  type: "Full-time", salary: "", description: "", isActive: true,
};

export default function AdminCareersPage() {
  const [jobs, setJobs]       = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [search, setSearch]   = useState("");
  const [editId, setEditId]   = useState<string | null>(null);
  const [form, setForm]       = useState<Omit<JobOpening, "id" | "createdAt">>(EMPTY_FORM);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "jobOpenings"), orderBy("createdAt", "desc")));
      setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() } as JobOpening)));
    } catch {
      toast.error("Failed to load job openings");
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditId("new");
    setForm(EMPTY_FORM);
  }

  function openEdit(job: JobOpening) {
    setEditId(job.id);
    setForm({ title: job.title, department: job.department, location: job.location, type: job.type, salary: job.salary, description: job.description, isActive: job.isActive });
  }

  async function save() {
    if (!form.title.trim() || !form.department.trim()) {
      toast.error("Title and department are required");
      return;
    }
    setSaving(true);
    try {
      if (editId === "new") {
        const ref = await addDoc(collection(db, "jobOpenings"), { ...form, createdAt: Timestamp.now() });
        setJobs(prev => [{ id: ref.id, ...form, createdAt: Timestamp.now() }, ...prev]);
        toast.success("Job posted successfully");
      } else if (editId) {
        await updateDoc(doc(db, "jobOpenings", editId), { ...form });
        setJobs(prev => prev.map(j => j.id === editId ? { ...j, ...form } : j));
        toast.success("Job updated");
      }
      setEditId(null);
      setForm(EMPTY_FORM);
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this job posting?")) return;
    try {
      await deleteDoc(doc(db, "jobOpenings", id));
      setJobs(prev => prev.filter(j => j.id !== id));
      toast.success("Job deleted");
    } catch {
      toast.error("Delete failed");
    }
  }

  async function toggleActive(job: JobOpening) {
    try {
      await updateDoc(doc(db, "jobOpenings", job.id), { isActive: !job.isActive });
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, isActive: !j.isActive } : j));
    } catch {
      toast.error("Update failed");
    }
  }

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.department.toLowerCase().includes(search.toLowerCase())
  );

  const openCount = jobs.filter(j => j.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Careers</h1>
          <p className="text-sm text-muted-foreground">
            {openCount} open {openCount === 1 ? "position" : "positions"} · {jobs.length} total
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Button onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" /> Post New Job
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search positions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Form */}
      {editId && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
          <h2 className="mb-4 font-semibold text-foreground">{editId === "new" ? "Post New Job" : "Edit Job Listing"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Job Title *</Label>
              <Input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Staff Nurse" />
            </div>
            <div>
              <Label>Department *</Label>
              <Input value={form.department} onChange={(e) => setForm(p => ({ ...p, department: e.target.value }))} placeholder="e.g. Nursing" />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setForm(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div>
              <Label>Type</Label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={form.type}
                onChange={(e) => setForm(p => ({ ...p, type: e.target.value }))}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
            <div>
              <Label>Salary Range</Label>
              <Input value={form.salary} onChange={(e) => setForm(p => ({ ...p, salary: e.target.value }))} placeholder="e.g. ₹5,00,000 – ₹7,00,000" />
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={form.isActive ? "open" : "closed"}
                onChange={(e) => setForm(p => ({ ...p, isActive: e.target.value === "open" }))}
              >
                <option value="open">Open (visible on website)</option>
                <option value="closed">Closed (hidden from website)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Role summary, responsibilities, qualifications…"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            <Button variant="outline" onClick={() => { setEditId(null); setForm(EMPTY_FORM); }}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl border border-border bg-card animate-pulse" />)}</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Position</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Salary</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr key={job.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{job.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {job.salary ? <div className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> {job.salary}</div> : <span className="text-muted-foreground/50">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(job)}>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${job.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {job.isActive ? "Open" : "Closed"}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(job)} className="rounded p-1 hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => remove(job.id)} className="rounded p-1 hover:bg-red-50 text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    {jobs.length === 0 ? "No job postings yet. Click 'Post New Job' to add one." : "No positions match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

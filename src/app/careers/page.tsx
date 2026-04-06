"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PageHero from "@/components/layout/PageHero";
import { MapPin, Clock, Briefcase, X, Send, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { SITE_NAME, CONTACT_PHONE } from "@/lib/constants";

interface Job {
  id: string;
  title: string;
  department: string;
  type: string;
  location?: string;
  description?: string;
  isActive: boolean;
  createdAt?: any;
}

const FALLBACK_JOBS: Omit<Job, "id" | "isActive" | "createdAt">[] = [
  { title: "Staff Nurse (GNM / B.Sc)",   department: "Nursing",        type: "Full-time" },
  { title: "Pharmacist",                  department: "Pharmacy",       type: "Full-time" },
  { title: "Lab Technician",              department: "Pathology",      type: "Full-time" },
  { title: "Front Desk Receptionist",     department: "Administration", type: "Full-time" },
  { title: "Attender / Ward Boy",         department: "General",        type: "Full-time" },
];

export default function CareersPage() {
  const [jobs, setJobs]           = useState<Job[]>([]);
  const [loading, setLoading]     = useState(true);
  const [applying, setApplying]   = useState<Job | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [form, setForm]           = useState({ name: "", phone: "", message: "" });

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, "jobOpenings"));
        const list = snap.docs
          .map(d => ({ id: d.id, ...d.data() } as Job))
          .filter(j => j.isActive !== false)
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
        setJobs(list.length ? list : FALLBACK_JOBS.map((j, i) => ({ ...j, id: String(i), isActive: true })));
      } catch {
        setJobs(FALLBACK_JOBS.map((j, i) => ({ ...j, id: String(i), isActive: true })));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleApply = async () => {
    if (!form.name.trim()) { toast.error("Please enter your name"); return; }
    if (!/^\d{10}$/.test(form.phone.trim().replace(/\D/g, ""))) { toast.error("Please enter a valid 10-digit phone number"); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, "jobApplications"), {
        position: applying?.title || "General Application",
        department: applying?.department || "",
        applicantName: form.name.trim(),
        applicantPhone: form.phone.trim().replace(/\D/g, ""),
        coverNote: form.message.trim(),
        status: "new",
        createdAt: Timestamp.now(),
      });
      setSubmitted(true);
      setForm({ name: "", phone: "", message: "" });
    } catch {
      toast.error("Submission failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => { setApplying(null); setSubmitted(false); setForm({ name: "", phone: "", message: "" }); };

  return (
    <>
      <PageHero
        title="Join Our Team"
        subtitle="Build your career at Dhanvantari Hospital. We're always looking for dedicated professionals."
        breadcrumbs={[{ label: "Careers" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">

          <div className="mb-10 rounded-xl border border-border bg-muted/30 p-8">
            <h2 className="mb-3 text-xl font-bold text-foreground">Why Work at Dhanvantari Hospital?</h2>
            <div className="grid gap-3 sm:grid-cols-3 text-sm text-muted-foreground">
              {["Competitive salary & benefits","Professional development","Collaborative environment","Work-life balance","24/7 Emergency Unit","Make a difference daily"].map(p => (
                <div key={p} className="flex items-center gap-2"><span className="text-green-600 font-bold">✓</span> {p}</div>
              ))}
            </div>
          </div>

          <h2 className="mb-6 text-xl font-bold text-foreground">Current Openings</h2>

          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl border border-border bg-card animate-pulse" />)}</div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="h-4 w-4 text-primary shrink-0" />
                      <h3 className="font-semibold text-foreground">{job.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Tanuku, AP</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.type || "Full-time"}</span>
                      {job.department && <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">{job.department}</span>}
                    </div>
                    {job.description && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{job.description}</p>}
                  </div>
                  <button
                    onClick={() => { setApplying(job); setSubmitted(false); }}
                    className="shrink-0 bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-muted-foreground text-sm">
              Don't see your role?{" "}
              <button onClick={() => setApplying({ id: "general", title: "General Application", department: "", type: "", isActive: true })}
                className="text-primary hover:underline font-medium">
                Send a general application
              </button>
              {CONTACT_PHONE && <> or call us at <a href={`tel:${CONTACT_PHONE}`} className="text-primary hover:underline font-medium">{CONTACT_PHONE}</a></>}.
            </p>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {applying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-foreground text-lg">Apply — {applying.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{SITE_NAME}, Tanuku</p>
              </div>
              <button onClick={closeModal} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-foreground mb-2">Application Submitted!</h4>
                <p className="text-sm text-muted-foreground">We'll review your application and reach out on your phone number. Thank you for your interest.</p>
                <button onClick={closeModal} className="mt-5 bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">Close</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Full Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Phone Number *</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="10-digit mobile number" type="tel" maxLength={10}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                  <p className="text-xs text-muted-foreground mt-1">We will call you on this number</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Brief Note (optional)</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your experience, qualifications, or anything relevant..."
                    rows={3}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                  Please bring your resume and certificates when called for interview. We will contact you within 3 working days.
                </p>
                <button onClick={handleApply} disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#152d4a] disabled:opacity-50 transition-colors">
                  {saving ? "Submitting…" : <><Send className="w-4 h-4" /> Submit Application</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

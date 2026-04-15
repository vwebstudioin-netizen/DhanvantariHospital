"use client";

import { useEffect, useState, useRef } from "react";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query, serverTimestamp,
} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { doctors as staticDoctors } from "@/data/doctors";
import { departments } from "@/data/departments";
import Image from "next/image";
import {
  Plus, Search, Pencil, Trash2, X, CheckCircle,
  Upload, User, Loader2, ChevronDown, ChevronUp, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import type { DoctorData } from "@/types";
import {
  DEFAULT_WEEKLY_SCHEDULE, WEEK_DAYS, type WeekDay, type WeeklySchedule,
} from "@/types/doctor";
import { formatDayScheduleSummary, getSlotsForDate } from "@/lib/scheduleUtils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FirestoreDoctor extends DoctorData {
  id: string;
}

// ── Blank form ────────────────────────────────────────────────────────────────

function blankDoctor(): DoctorData {
  return {
    slug: "",
    firstName: "",
    lastName: "",
    title: "Dr.",
    credentials: "",
    specialty: "",
    subspecialties: [],
    departmentSlugs: [],
    locationSlugs: ["main"],
    bio: "",
    education: [],
    certifications: [],
    languages: ["English", "Telugu", "Hindi"],
    gender: "male",
    acceptingNewPatients: true,
    offersTelehealth: false,
    conditionsTreated: [],
    proceduresPerformed: [],
    image: "",
    weeklySchedule: { ...DEFAULT_WEEKLY_SCHEDULE },
  };
}

// ── Seed static doctors into Firestore if collection is empty ─────────────────

async function seedIfEmpty(setDoctors: (d: FirestoreDoctor[]) => void) {
  const snap = await getDocs(query(collection(db, "doctors"), orderBy("slug")));
  if (!snap.empty) {
    setDoctors(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FirestoreDoctor));
    return;
  }
  const seeded: FirestoreDoctor[] = [];
  for (const d of staticDoctors) {
    const ref = await addDoc(collection(db, "doctors"), {
      ...d,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    seeded.push({ id: ref.id, ...d });
  }
  setDoctors(seeded);
  toast.success(`${seeded.length} doctors imported`);
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<FirestoreDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"info" | "schedule">("info");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DoctorData>(blankDoctor());
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Expanded detail row
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Load ──────────────────────────────────────────────────────────────────

  async function loadDoctors() {
    setLoading(true);
    try {
      await seedIfEmpty(setDoctors);
    } catch {
      setDoctors(staticDoctors.map((d, i) => ({ id: `static-${i}`, ...d })));
      toast.error("Using static fallback — Firestore unavailable");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDoctors(); }, []); // eslint-disable-line

  // ── Filtered list ─────────────────────────────────────────────────────────

  const filtered = doctors.filter((d) => {
    const term = search.toLowerCase();
    const matchSearch = !term ||
      `${d.firstName} ${d.lastName} ${d.specialty} ${d.credentials}`
        .toLowerCase().includes(term);
    const matchDept = !filterDept || d.departmentSlugs.includes(filterDept);
    return matchSearch && matchDept;
  });

  // ── Modal helpers ─────────────────────────────────────────────────────────

  function openNew() {
    setForm(blankDoctor());
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setModalTab("info");
    setModalOpen(true);
  }

  function openEdit(d: FirestoreDoctor) {
    setForm({ ...d, weeklySchedule: d.weeklySchedule ?? { ...DEFAULT_WEEKLY_SCHEDULE } });
    setEditingId(d.id);
    setImageFile(null);
    setImagePreview(d.image || "");
    setModalTab("info");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setModalTab("info");
  }

  // ── Image upload ──────────────────────────────────────────────────────────

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadImage(file: File, slug: string): Promise<string> {
    setUploadingImage(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `images/doctors/${slug || Date.now()}.${ext}`;
      const sRef = storageRef(storage, path);
      await uploadBytes(sRef, file);
      return await getDownloadURL(sRef);
    } finally {
      setUploadingImage(false);
    }
  }

  // ── Save ──────────────────────────────────────────────────────────────────

  async function handleSave() {
    if (!form.firstName.trim()) { toast.error("First name is required"); return; }
    if (!form.specialty.trim()) { toast.error("Specialty is required"); return; }
    setSaving(true);
    try {
      const slug = form.slug.trim() ||
        `dr-${form.firstName.toLowerCase().replace(/\s+/g, "-")}${form.lastName ? `-${form.lastName.toLowerCase().replace(/\s+/g, "-")}` : ""}`;
      let imageUrl = form.image;
      if (imageFile) imageUrl = await uploadImage(imageFile, slug);

      const payload: DoctorData = { ...form, slug, image: imageUrl };

      if (editingId && !editingId.startsWith("static-")) {
        await updateDoc(doc(db, "doctors", editingId), { ...payload, updatedAt: serverTimestamp() });
        setDoctors((prev) => prev.map((d) => d.id === editingId ? { ...d, ...payload } : d));
        toast.success("Doctor updated");
      } else {
        const ref = await addDoc(collection(db, "doctors"), {
          ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        });
        setDoctors((prev) => [...prev, { id: ref.id, ...payload }]);
        toast.success("Doctor added");
      }
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      if (!id.startsWith("static-")) await deleteDoc(doc(db, "doctors", id));
      setDoctors((prev) => prev.filter((d) => d.id !== id));
      toast.success("Doctor removed");
    } catch {
      toast.error("Failed to delete");
    }
  }

  // ── Array / comma helpers ─────────────────────────────────────────────────

  const commaToArray = (v: string) => v.split(",").map((s) => s.trim()).filter(Boolean);
  const arrayToComma = (a: string[]) => a.join(", ");

  function addEdu() {
    setForm((f) => ({
      ...f, education: [...f.education, { degree: "", institution: "", year: new Date().getFullYear() }],
    }));
  }
  function removeEdu(i: number) {
    setForm((f) => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }));
  }
  function updateEdu(i: number, field: "degree" | "institution" | "year", value: string | number) {
    setForm((f) => {
      const edu = [...f.education];
      edu[i] = { ...edu[i], [field]: field === "year" ? Number(value) : value };
      return { ...f, education: edu };
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Doctors</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{doctors.length} doctor{doctors.length !== 1 && "s"} total</p>
        </div>
        <Button onClick={openNew} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Doctor
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialty, credentials…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.slug} value={d.slug}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border py-16 text-center text-muted-foreground">
          No doctors found.
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          {filtered.map((d, idx) => (
            <div key={d.id} className={idx !== 0 ? "border-t border-border" : ""}>

              {/* Card row */}
              <div className="flex items-center gap-4 px-4 py-3 bg-card hover:bg-muted/30 transition-colors">
                {/* Photo */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-primary/10">
                  {d.image ? (
                    <Image
                      src={d.image} alt={`${d.title} ${d.firstName}`} fill
                      className="object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-bold text-primary">
                      {d.firstName[0]}{d.lastName[0] || ""}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {d.title} {d.firstName} {d.lastName}
                  </p>
                  <p className="text-xs text-primary truncate">{d.specialty}</p>
                  <p className="text-xs text-muted-foreground truncate">{d.credentials}</p>
                </div>

                {/* Status badges */}
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <Badge variant={d.acceptingNewPatients ? "default" : "secondary"} className="text-xs">
                    {d.acceptingNewPatients ? "Active" : "Inactive"}
                  </Badge>
                  {d.offersTelehealth && (
                    <Badge variant="outline" className="text-xs">Telehealth</Badge>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost" size="sm" className="h-8 w-8 p-0" title="Details"
                    onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
                  >
                    {expandedId === d.id
                      ? <ChevronUp className="h-4 w-4" />
                      : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost" size="sm"
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                    title="Edit" onClick={() => openEdit(d)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost" size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    title="Delete"
                    onClick={() => handleDelete(d.id, `${d.title} ${d.firstName} ${d.lastName}`)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === d.id && (
                <div className="bg-muted/20 border-t border-border px-4 py-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                  <div className="sm:col-span-2 lg:col-span-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Bio</p>
                    <p className="text-foreground leading-relaxed">{d.bio || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Subspecialties</p>
                    <div className="flex flex-wrap gap-1">
                      {d.subspecialties.length > 0
                        ? d.subspecialties.map((s) => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)
                        : <span className="text-muted-foreground">—</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Conditions Treated</p>
                    <p className="text-muted-foreground">{d.conditionsTreated.join(", ") || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Procedures</p>
                    <p className="text-muted-foreground">{d.proceduresPerformed.join(", ") || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Education</p>
                    {d.education.length > 0
                      ? d.education.map((e, i) => (
                        <p key={i} className="text-muted-foreground">{e.degree} — {e.institution} ({e.year})</p>
                      ))
                      : <span className="text-muted-foreground">—</span>}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Certifications</p>
                    <p className="text-muted-foreground">{d.certifications.join(", ") || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Languages</p>
                    <p className="text-muted-foreground">{d.languages.join(", ") || "—"}</p>
                  </div>
                  {/* Weekly schedule summary */}
                  {d.weeklySchedule && (
                    <div className="sm:col-span-2 lg:col-span-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Weekly Schedule</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                        {WEEK_DAYS.map((day) => {
                          const ds = d.weeklySchedule?.[day];
                          return (
                            <div key={day} className={`rounded-md border p-2 text-xs ${
                              ds?.available ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20"
                            }`}>
                              <p className="font-semibold capitalize mb-0.5">{day.slice(0, 3)}</p>
                              <p className="text-muted-foreground leading-snug">
                                {formatDayScheduleSummary(ds ?? null)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Edit / Add Modal ───────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10">
          <div className="w-full max-w-2xl rounded-2xl bg-card shadow-2xl">

            {/* Modal header */}
            <div className="border-b border-border px-6 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-foreground">
                  {editingId ? "Edit Doctor" : "Add Doctor"}
                </h2>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* Tabs */}
              <div className="flex gap-1 -mb-px">
                {(["info", "schedule"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setModalTab(tab)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      modalTab === tab
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "schedule" && <Clock className="h-3.5 w-3.5" />}
                    {tab === "info" ? "Doctor Info" : "Weekly Schedule"}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal body */}
            <div className="max-h-[72vh] overflow-y-auto px-6 py-5 space-y-5">

              {/* ── INFO TAB ─────────────────────────────────────────────── */}
              {modalTab === "info" && (<>

              {/* Photo */}
              <div>
                <Label className="mb-2 block text-sm font-semibold">Doctor Photo</Label>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-border bg-muted">
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <User className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file" accept="image/*" ref={imageInputRef}
                      onChange={handleImageChange} className="hidden"
                    />
                    <Button
                      type="button" variant="outline" size="sm" className="gap-2"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      {imagePreview ? "Change Photo" : "Upload Photo"}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, WebP — max 2 MB recommended
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic info */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label className="mb-1 block text-sm">Title</Label>
                  <select
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option>Dr.</option>
                    <option>Prof.</option>
                    <option>Assoc. Prof.</option>
                  </select>
                </div>
                <div>
                  <Label className="mb-1 block text-sm">First Name *</Label>
                  <Input
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    placeholder="e.g. Ayyapa"
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-sm">Last Name</Label>
                  <Input
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    placeholder="e.g. Reddy"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-1 block text-sm">Credentials</Label>
                  <Input
                    value={form.credentials}
                    onChange={(e) => setForm((f) => ({ ...f, credentials: e.target.value }))}
                    placeholder="e.g. MBBS, MD (Emergency)"
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-sm">Specialty *</Label>
                  <Input
                    value={form.specialty}
                    onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
                    placeholder="e.g. Emergency & Critical Care"
                  />
                </div>
              </div>

              {/* Slug */}
              <div>
                <Label className="mb-1 block text-sm">
                  URL Slug{" "}
                  <span className="font-normal text-muted-foreground">(auto-generated if left blank)</span>
                </Label>
                <Input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))
                  }
                  placeholder="e.g. dr-ayyapa"
                />
              </div>

              {/* Gender */}
              <div>
                <Label className="mb-1 block text-sm">Gender</Label>
                <select
                  value={form.gender}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, gender: e.target.value as "male" | "female" | "other" }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Departments checkboxes */}
              <div>
                <Label className="mb-2 block text-sm font-semibold">Departments</Label>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {departments.map((dept) => (
                    <label key={dept.slug} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.departmentSlugs.includes(dept.slug)}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            departmentSlugs: e.target.checked
                              ? [...f.departmentSlugs, dept.slug]
                              : f.departmentSlugs.filter((s) => s !== dept.slug),
                          }))
                        }
                        className="accent-primary"
                      />
                      <span className="truncate">{dept.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <Label className="mb-1 block text-sm">Bio / About</Label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  rows={4}
                  placeholder="Professional biography shown on the public doctors page…"
                  className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Subspecialties */}
              <div>
                <Label className="mb-1 block text-sm">
                  Subspecialties{" "}
                  <span className="font-normal text-muted-foreground">(comma-separated)</span>
                </Label>
                <Input
                  value={arrayToComma(form.subspecialties)}
                  onChange={(e) => setForm((f) => ({ ...f, subspecialties: commaToArray(e.target.value) }))}
                  placeholder="e.g. Trauma Surgery, Critical Care, ICU"
                />
              </div>

              {/* Conditions Treated */}
              <div>
                <Label className="mb-1 block text-sm">
                  Conditions Treated{" "}
                  <span className="font-normal text-muted-foreground">(comma-separated)</span>
                </Label>
                <Input
                  value={arrayToComma(form.conditionsTreated)}
                  onChange={(e) => setForm((f) => ({ ...f, conditionsTreated: commaToArray(e.target.value) }))}
                  placeholder="e.g. Fractures, Diabetes, Hypertension"
                />
              </div>

              {/* Procedures */}
              <div>
                <Label className="mb-1 block text-sm">
                  Procedures Performed{" "}
                  <span className="font-normal text-muted-foreground">(comma-separated)</span>
                </Label>
                <Input
                  value={arrayToComma(form.proceduresPerformed)}
                  onChange={(e) => setForm((f) => ({ ...f, proceduresPerformed: commaToArray(e.target.value) }))}
                  placeholder="e.g. ECG, Laparoscopy, CPR"
                />
              </div>

              {/* Certifications */}
              <div>
                <Label className="mb-1 block text-sm">
                  Certifications{" "}
                  <span className="font-normal text-muted-foreground">(comma-separated)</span>
                </Label>
                <Input
                  value={arrayToComma(form.certifications)}
                  onChange={(e) => setForm((f) => ({ ...f, certifications: commaToArray(e.target.value) }))}
                  placeholder="e.g. ACLS, BLS, FCCS"
                />
              </div>

              {/* Languages */}
              <div>
                <Label className="mb-1 block text-sm">
                  Languages{" "}
                  <span className="font-normal text-muted-foreground">(comma-separated)</span>
                </Label>
                <Input
                  value={arrayToComma(form.languages)}
                  onChange={(e) => setForm((f) => ({ ...f, languages: commaToArray(e.target.value) }))}
                  placeholder="e.g. English, Telugu, Hindi"
                />
              </div>

              {/* Education */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-sm font-semibold">Education</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={addEdu} className="gap-1 text-xs h-7">
                    <Plus className="h-3 w-3" /> Add
                  </Button>
                </div>
                {form.education.length === 0 && (
                  <p className="text-xs text-muted-foreground">No entries yet — click Add to add a degree.</p>
                )}
                <div className="space-y-2">
                  {form.education.map((edu, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1.5fr_80px_32px] gap-2 items-center">
                      <Input
                        placeholder="Degree (e.g. MBBS)"
                        value={edu.degree}
                        onChange={(e) => updateEdu(i, "degree", e.target.value)}
                      />
                      <Input
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) => updateEdu(i, "institution", e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Year"
                        value={edu.year}
                        onChange={(e) => updateEdu(i, "year", e.target.value)}
                      />
                      <button
                        type="button" onClick={() => removeEdu(i)}
                        className="flex h-9 w-8 items-center justify-center text-red-400 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.acceptingNewPatients}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, acceptingNewPatients: v }))}
                  />
                  <Label>Accepting New Patients</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.offersTelehealth}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, offersTelehealth: v }))}
                  />
                  <Label>Offers Telehealth</Label>
                </div>
              </div>

              </>)} {/* end INFO TAB */}

              {/* ── SCHEDULE TAB ─────────────────────────────────────────── */}
              {modalTab === "schedule" && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground mb-4">
                    Set the doctor&apos;s regular weekly availability. These times will be used to generate
                    appointment slots on the booking page.
                  </p>
                  {WEEK_DAYS.map((day) => {
                    const ds = form.weeklySchedule?.[day] ?? DEFAULT_WEEKLY_SCHEDULE[day];
                    const slotCount = ds.available
                      ? getSlotsForDate({ ...DEFAULT_WEEKLY_SCHEDULE, [day]: ds }, new Date(2024, 0, [
                          8, 9, 10, 11, 12, 13, 14, // Mon(8)=Jan8, Tue=Jan9, ... Sun=Jan14 2024
                        ][WEEK_DAYS.indexOf(day)]))
                      : [];
                    return (
                      <div
                        key={day}
                        className={`rounded-lg border p-3 transition-colors ${
                          ds.available ? "border-border bg-card" : "border-border/40 bg-muted/20"
                        }`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                          {/* Day name + toggle */}
                          <div className="flex items-center gap-3 sm:w-36 shrink-0">
                            <Switch
                              checked={ds.available}
                              onCheckedChange={(v) =>
                                setForm((f) => ({
                                  ...f,
                                  weeklySchedule: {
                                    ...(f.weeklySchedule ?? DEFAULT_WEEKLY_SCHEDULE),
                                    [day]: { ...ds, available: v },
                                  } as WeeklySchedule,
                                }))
                              }
                            />
                            <span className="text-sm font-semibold capitalize">{day}</span>
                          </div>

                          {ds.available ? (
                            <div className="flex-1 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                              {/* From */}
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">From</Label>
                                <input
                                  type="time"
                                  value={ds.from}
                                  onChange={(e) =>
                                    setForm((f) => ({
                                      ...f,
                                      weeklySchedule: {
                                        ...(f.weeklySchedule ?? DEFAULT_WEEKLY_SCHEDULE),
                                        [day]: { ...ds, from: e.target.value },
                                      } as WeeklySchedule,
                                    }))
                                  }
                                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                                />
                              </div>
                              {/* To */}
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">To</Label>
                                <input
                                  type="time"
                                  value={ds.to}
                                  onChange={(e) =>
                                    setForm((f) => ({
                                      ...f,
                                      weeklySchedule: {
                                        ...(f.weeklySchedule ?? DEFAULT_WEEKLY_SCHEDULE),
                                        [day]: { ...ds, to: e.target.value },
                                      } as WeeklySchedule,
                                    }))
                                  }
                                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                                />
                              </div>
                              {/* Slot duration */}
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">Slot (min)</Label>
                                <select
                                  value={ds.slotDuration}
                                  onChange={(e) =>
                                    setForm((f) => ({
                                      ...f,
                                      weeklySchedule: {
                                        ...(f.weeklySchedule ?? DEFAULT_WEEKLY_SCHEDULE),
                                        [day]: { ...ds, slotDuration: Number(e.target.value) },
                                      } as WeeklySchedule,
                                    }))
                                  }
                                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                                >
                                  <option value={10}>10 min</option>
                                  <option value={15}>15 min</option>
                                  <option value={20}>20 min</option>
                                  <option value={30}>30 min</option>
                                  <option value={45}>45 min</option>
                                  <option value={60}>60 min</option>
                                </select>
                              </div>
                              {/* Break from */}
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">Break from</Label>
                                <input
                                  type="time"
                                  value={ds.breakFrom ?? ""}
                                  onChange={(e) =>
                                    setForm((f) => ({
                                      ...f,
                                      weeklySchedule: {
                                        ...(f.weeklySchedule ?? DEFAULT_WEEKLY_SCHEDULE),
                                        [day]: { ...ds, breakFrom: e.target.value || undefined },
                                      } as WeeklySchedule,
                                    }))
                                  }
                                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                                />
                              </div>
                              {/* Break to */}
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">Break to</Label>
                                <input
                                  type="time"
                                  value={ds.breakTo ?? ""}
                                  onChange={(e) =>
                                    setForm((f) => ({
                                      ...f,
                                      weeklySchedule: {
                                        ...(f.weeklySchedule ?? DEFAULT_WEEKLY_SCHEDULE),
                                        [day]: { ...ds, breakTo: e.target.value || undefined },
                                      } as WeeklySchedule,
                                    }))
                                  }
                                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                                />
                              </div>
                              {/* Slot count preview */}
                              <div className="flex items-end">
                                <p className="text-xs text-muted-foreground">
                                  <span className="font-semibold text-primary">{slotCount.length}</span> slots/day
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic self-center">Not available</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <Button variant="outline" onClick={closeModal} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving || uploadingImage} className="gap-2 min-w-[140px]">
                {(saving || uploadingImage)
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> {uploadingImage ? "Uploading…" : "Saving…"}</>
                  : <><CheckCircle className="h-4 w-4" /> {editingId ? "Update Doctor" : "Add Doctor"}</>
                }
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

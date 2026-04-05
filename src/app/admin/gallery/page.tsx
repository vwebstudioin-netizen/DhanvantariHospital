"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Trash2, RefreshCw, Image } from "lucide-react";
import toast from "react-hot-toast";
import { GALLERY_CATEGORIES } from "@/lib/constants";

interface GalleryImage {
  id: string; title: string; url: string; category: string;
  description?: string; createdAt: any;
}

const EMPTY = { title: "", url: "", category: GALLERY_CATEGORIES[0], description: "" };

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState("all");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "gallery"), orderBy("createdAt", "desc")));
      setImages(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as GalleryImage[]);
    } catch { toast.error("Failed to load gallery"); }
    finally { setLoading(false); }
  }

  const handleAdd = async () => {
    if (!form.title || !form.url) { toast.error("Title and image URL are required"); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, "gallery"), { ...form, createdAt: Timestamp.now() });
      toast.success("Image added to gallery");
      setShowForm(false); setForm({ ...EMPTY }); load();
    } catch { toast.error("Failed to add"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this image from gallery?")) return;
    await deleteDoc(doc(db, "gallery", id));
    toast.success("Removed"); load();
  };

  const filtered = filterCat === "all" ? images : images.filter((i) => i.category === filterCat);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">Gallery</h1>
          <p className="text-muted-foreground text-sm">{images.length} images across {GALLERY_CATEGORIES.length} categories</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground">Add Image to Gallery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Title *", key: "title", placeholder: "e.g. ICU Ward" },
              { label: "Image URL *", key: "url", placeholder: "https://... or /images/..." },
              { label: "Description", key: "description", placeholder: "Optional description" },
            ].map((f) => (
              <div key={f.key} className={f.key === "url" ? "sm:col-span-2" : ""}>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                <input value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          {form.url && <img src={form.url} alt="Preview" className="h-32 w-auto object-cover rounded-lg border border-border" onError={(e) => (e.currentTarget.style.display = "none")} />}
          <div className="flex gap-3">
            <button onClick={handleAdd} disabled={saving}
              className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-50">
              {saving ? "Adding..." : "Add to Gallery"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm font-medium text-muted-foreground border border-border hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-1 flex-wrap">
        <button onClick={() => setFilterCat("all")} className={`px-3 py-1.5 text-xs font-medium rounded-lg ${filterCat === "all" ? "bg-[#1e3a5f] text-white" : "bg-card border border-border text-muted-foreground"}`}>All ({images.length})</button>
        {GALLERY_CATEGORIES.map((c) => (
          <button key={c} onClick={() => setFilterCat(c)} className={`px-3 py-1.5 text-xs font-medium rounded-lg ${filterCat === c ? "bg-[#1e3a5f] text-white" : "bg-card border border-border text-muted-foreground"}`}>
            {c} ({images.filter((i) => i.category === c).length})
          </button>
        ))}
      </div>

      {loading ? <div className="text-center py-12 text-muted-foreground">Loading gallery...</div> : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Image className="w-12 h-12 mx-auto mb-3 opacity-20" />
          No images yet. Add images using their URL.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img) => (
            <div key={img.id} className="group relative rounded-xl border border-border overflow-hidden bg-muted/30">
              <div className="aspect-square">
                {img.url ? (
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Image className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-foreground truncate">{img.title}</p>
                <p className="text-[10px] text-muted-foreground">{img.category}</p>
              </div>
              <button onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-red-600 text-white rounded-lg transition-opacity">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

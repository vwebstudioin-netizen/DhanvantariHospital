"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Search, Edit, Trash2, RefreshCw, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { BLOG_CATEGORIES } from "@/lib/constants";

interface BlogPost {
  id: string; title: string; slug: string; excerpt: string; content: string;
  category: string; author: string; status: "draft" | "published";
  tags?: string; createdAt: any; updatedAt?: any;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const EMPTY: Omit<BlogPost, "id" | "createdAt"> = {
  title: "", slug: "", excerpt: "", content: "", category: BLOG_CATEGORIES[0], author: "Admin", status: "draft", tags: "",
};

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "blogPosts"), orderBy("createdAt", "desc")));
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as BlogPost[]);
    } catch { toast.error("Failed to load posts"); }
    finally { setLoading(false); }
  }

  const handleSave = async () => {
    if (!form.title) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const slug = form.slug || slugify(form.title);
      const data = { ...form, slug, updatedAt: Timestamp.now() };
      if (editId) {
        await updateDoc(doc(db, "blogPosts", editId), data);
        toast.success("Post updated");
      } else {
        await addDoc(collection(db, "blogPosts"), { ...data, createdAt: Timestamp.now() });
        toast.success("Post created");
      }
      setShowForm(false); setEditId(null); setForm({ ...EMPTY }); load();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const handleEdit = (p: BlogPost) => {
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, category: p.category, author: p.author, status: p.status, tags: p.tags || "" });
    setEditId(p.id); setShowForm(true);
  };

  const toggleStatus = async (p: BlogPost) => {
    const status = p.status === "published" ? "draft" : "published";
    await updateDoc(doc(db, "blogPosts", p.id), { status, updatedAt: Timestamp.now() });
    toast.success(status === "published" ? "Post published" : "Post unpublished");
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await deleteDoc(doc(db, "blogPosts", id));
    toast.success("Deleted"); load();
  };

  const filtered = posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground text-sm">{posts.filter(p => p.status === "published").length} published · {posts.filter(p => p.status === "draft").length} drafts</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ ...EMPTY }); }}
            className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a]">
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground">{editId ? "Edit Post" : "New Blog Post"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
                placeholder="Post title" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Author</label>
              <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Excerpt (short description)</label>
              <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2}
                placeholder="Brief description shown in blog listing..." className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Content</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8}
                placeholder="Full blog post content..." className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="health, tips, cardiology"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-50">
              {saving ? "Saving..." : editId ? "Update Post" : "Create Post"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm font-medium text-muted-foreground border border-border hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..."
          className="w-full pl-9 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No posts yet. Click "New Post" to create one.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-xs">{p.excerpt}</p>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{p.category}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground hidden md:table-cell">
                    {p.createdAt?.toDate?.()?.toLocaleDateString("en-IN") || "—"}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => toggleStatus(p)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg" title={p.status === "published" ? "Unpublish" : "Publish"}>
                        {p.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleEdit(p)} className="p-1.5 text-muted-foreground hover:text-[#1e3a5f] hover:bg-muted rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

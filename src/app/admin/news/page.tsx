"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search, Newspaper, Eye, Calendar } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  status: "published" | "draft";
  views: number;
}

const initialNews: NewsItem[] = [
  { id: "1", title: "Dhanvantari Hospital Launches New Telehealth Platform", excerpt: "Patients can now access virtual consultations from the comfort of home.", category: "Technology", author: "Admin", date: "2025-01-15", status: "published", views: 1240 },
  { id: "2", title: "Free Health Screening Camp — March 2025", excerpt: "Annual community health screening event at our Main Campus location.", category: "Events", author: "Dr. Priya Sharma", date: "2025-02-01", status: "published", views: 890 },
  { id: "3", title: "New Pediatric Wing Opening", excerpt: "Expanded pediatric facilities with state-of-the-art equipment.", category: "Announcements", author: "Admin", date: "2025-02-10", status: "draft", views: 0 },
  { id: "4", title: "Flu Season Preparedness Guide", excerpt: "Tips and vaccination information for the upcoming flu season.", category: "Health Tips", author: "Dr. Arjun Patel", date: "2025-01-28", status: "published", views: 2130 },
];

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<NewsItem>>({});

  const filtered = news.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.category.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() {
    setEditId("new");
    setForm({ title: "", excerpt: "", category: "", author: "", date: new Date().toISOString().split("T")[0], status: "draft", views: 0 });
  }

  function openEdit(n: NewsItem) {
    setEditId(n.id);
    setForm(n);
  }

  function save() {
    if (!form.title) return;
    if (editId === "new") {
      setNews((prev) => [...prev, { ...form, id: Date.now().toString() } as NewsItem]);
    } else {
      setNews((prev) => prev.map((n) => (n.id === editId ? { ...n, ...form } : n)));
    }
    setEditId(null);
    setForm({});
  }

  function remove(id: string) {
    setNews((prev) => prev.filter((n) => n.id !== id));
  }

  function toggleStatus(id: string) {
    setNews((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: n.status === "published" ? "draft" : "published" } : n))
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage News</h1>
          <p className="text-sm text-muted-foreground">
            {news.filter((n) => n.status === "published").length} published &middot; {news.filter((n) => n.status === "draft").length} drafts
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> Add Article
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {editId && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
          <h2 className="mb-4 font-semibold text-foreground">{editId === "new" ? "New Article" : "Edit Article"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Title</Label>
              <Input value={form.title || ""} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Label>Excerpt</Label>
              <Input value={form.excerpt || ""} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={form.category || ""} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="e.g. Health Tips, Events" />
            </div>
            <div>
              <Label>Author</Label>
              <Input value={form.author || ""} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))} />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={form.date || ""} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={form.status || "draft"}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "published" | "draft" }))}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Article</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Views</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((n) => (
              <tr key={n.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.excerpt}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{n.category}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {n.date}</div>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStatus(n.id)}>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${n.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {n.status}
                    </span>
                  </button>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div className="flex items-center gap-1"><Eye className="h-3 w-3" /> {n.views.toLocaleString()}</div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(n)} className="rounded p-1 hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => remove(n.id)} className="rounded p-1 hover:bg-red-50 text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">No articles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

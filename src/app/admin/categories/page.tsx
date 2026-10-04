"use client";
import { useState } from "react";
import { Plus, ArrowUp, ArrowDown, Power, Trash2 } from "lucide-react";
import { AdminShell } from "@/app/admin/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";
import { uid, slugify } from "@/lib/utils";
import { iconFor } from "@/components/marketplace/icons";
import type { Category } from "@/types";

export default function AdminCategories() {
  const categories = useApp((s) => s.categories);
  const upsert = useApp((s) => s.upsertCategory);
  const delCat = useApp((s) => s.deleteCategory);
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  const save = () => {
    if (!name.trim()) return;
    if (editing) {
      upsert({ ...editing, name: name.trim(), slug: slugify(name.trim()) });
      toast({ title: "Category updated", kind: "success" });
    } else {
      upsert({ id: uid("c"), slug: slugify(name.trim()), name: name.trim(), icon: "briefcase", description: "New demo category.", serviceCount: 0, active: true, order: categories.length + 1, subcategories: [] });
      toast({ title: "Category created", kind: "success" });
    }
    setName(""); setEditing(null);
  };

  return (
    <AdminShell title="Categories" breadcrumb={["Admin", "Categories"]}>
      <Card className="mb-4 flex flex-col gap-2 p-4 sm:flex-row sm:items-end">
        <div className="flex-1"><Label>{editing ? "Rename category" : "New category name"}</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Appliance Repair" /></div>
        <Button onClick={save}><Plus className="h-4 w-4" /> {editing ? "Save" : "Create"}</Button>
        {editing && <Button variant="ghost" onClick={() => { setEditing(null); setName(""); }}>Cancel</Button>}
      </Card>
      <div className="grid gap-2.5">
        {sorted.map((c) => {
          const Icon = iconFor(c.icon);
          return (
            <Card key={c.id} className="flex flex-wrap items-center gap-3 p-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#EFF6FF] text-[#2563EB]"><Icon className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">#{c.order} {c.name} {!c.active && <span className="text-xs text-slate-400">(inactive)</span>}</p>
                <p className="truncate text-xs text-[#64748B]">{c.subcategories.join(" · ") || "No subcategories"}</p>
              </div>
              <div className="flex gap-1.5">
                <Button size="sm" variant="ghost" onClick={() => { upsert({ ...c, order: c.order - 1 }); }} aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" onClick={() => { upsert({ ...c, order: c.order + 1 }); }} aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="outline" onClick={() => { setEditing(c); setName(c.name); }}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => { upsert({ ...c, active: !c.active }); toast({ title: c.active ? "Deactivated" : "Activated", kind: "success" }); }}><Power className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" onClick={() => {
                  const ok = delCat(c.id);
                  toast({ title: ok ? "Deleted" : "Cannot delete — active services reference it", kind: ok ? "success" : "error" });
                }}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
              </div>
            </Card>
          );
        })}
      </div>
    </AdminShell>
  );
}

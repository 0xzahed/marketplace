"use client";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { useApp } from "@/store/app-store";
import { ServiceCard } from "@/components/marketplace/cards";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/states";
import { Badge } from "@/components/ui/badge";

export type Filters = {
  q: string; location: string; category: string; min: string; max: string;
  rating: string; verifiedOnly: boolean; mode: string; avail: string;
};

const RATINGS = [{ v: "", l: "Any rating" }, { v: "4", l: "4.0+" }, { v: "4.5", l: "4.5+" }, { v: "4.8", l: "4.8+" }];

export function ServiceBrowse({ initial }: { initial?: Partial<Filters> }) {
  const params = useSearchParams();
  const router = useRouter();
  const services = useApp((s) => s.services);
  const providers = useApp((s) => s.providers);
  const categories = useApp((s) => s.categories);

  const [f, setF] = useState<Filters>({
    q: initial?.q ?? params.get("q") ?? "",
    location: initial?.location ?? params.get("location") ?? "",
    category: initial?.category ?? params.get("category") ?? "",
    min: "", max: "", rating: "", verifiedOnly: false, mode: "", avail: "",
  });
  const [sort, setSort] = useState("recommended");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [drawer, setDrawer] = useState(false);
  const [visible, setVisible] = useState(9);

  const provOf = (pid: string) => providers.find((p) => p.id === pid);

  const results = useMemo(() => {
    let r = services.filter((s) => s.status === "Published");
    if (f.q) {
      const q = f.q.toLowerCase();
      r = r.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || provOf(s.providerId)?.name.toLowerCase().includes(q));
    }
    if (f.location) r = r.filter((s) => s.location.toLowerCase().includes(f.location.toLowerCase()) || provOf(s.providerId)?.serviceAreas.some((a) => a.toLowerCase().includes(f.location.toLowerCase())));
    if (f.category) r = r.filter((s) => s.categoryId === f.category);
    if (f.min) r = r.filter((s) => s.startingPrice >= Number(f.min));
    if (f.max) r = r.filter((s) => s.startingPrice <= Number(f.max));
    if (f.rating) r = r.filter((s) => s.rating >= Number(f.rating));
    if (f.verifiedOnly) r = r.filter((s) => s.verified);
    if (f.mode === "onsite") r = r.filter((s) => s.mode === "onsite" || s.mode === "either");
    if (f.mode === "remote") r = r.filter((s) => s.mode === "remote" || s.mode === "either");
    switch (sort) {
      case "rating": r = [...r].sort((a, b) => b.rating - a.rating); break;
      case "low": r = [...r].sort((a, b) => a.startingPrice - b.startingPrice); break;
      case "high": r = [...r].sort((a, b) => b.startingPrice - a.startingPrice); break;
      case "reviewed": r = [...r].sort((a, b) => b.reviewCount - a.reviewCount); break;
    }
    return r;
  }, [services, f, sort]);

  const chips: { label: string; clear: () => void }[] = [];
  if (f.q) chips.push({ label: `"${f.q}"`, clear: () => setF({ ...f, q: "" }) });
  if (f.location) chips.push({ label: f.location, clear: () => setF({ ...f, location: "" }) });
  if (f.category) chips.push({ label: categories.find((c) => c.id === f.category)?.name ?? f.category, clear: () => setF({ ...f, category: "" }) });
  if (f.verifiedOnly) chips.push({ label: "Verified only", clear: () => setF({ ...f, verifiedOnly: false }) });

  const filterBody = (
    <div className="space-y-5">
      <div>
        <h4 className="text-[13px] font-semibold">Category</h4>
        <div className="mt-2 space-y-1">
          <label className="flex items-center gap-2 text-sm"><input type="radio" name="cat" checked={!f.category} onChange={() => setF({ ...f, category: "" })} /> All</label>
          {categories.filter((c) => c.active).map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm text-[#334155]">
              <input type="radio" name="cat" checked={f.category === c.id} onChange={() => setF({ ...f, category: c.id })} /> {c.name}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-[13px] font-semibold">Price range (৳)</h4>
        <div className="mt-2 flex gap-2">
          <Input placeholder="Min" inputMode="numeric" value={f.min} onChange={(e) => setF({ ...f, min: e.target.value })} />
          <Input placeholder="Max" inputMode="numeric" value={f.max} onChange={(e) => setF({ ...f, max: e.target.value })} />
        </div>
      </div>
      <div>
        <h4 className="text-[13px] font-semibold">Rating</h4>
        <div className="mt-2 space-y-1">
          {RATINGS.map((r) => (
            <label key={r.v} className="flex items-center gap-2 text-sm"><input type="radio" name="rating" checked={f.rating === r.v} onChange={() => setF({ ...f, rating: r.v })} /> {r.l}</label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-[13px] font-semibold">Service mode</h4>
        <Select className="mt-2" value={f.mode} onChange={(e) => setF({ ...f, mode: e.target.value })}>
          <option value="">Either</option><option value="onsite">On-site</option><option value="remote">Remote</option>
        </Select>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={f.verifiedOnly} onChange={(e) => setF({ ...f, verifiedOnly: e.target.checked })} /> Verified professionals only</label>
      <Button variant="outline" className="w-full" onClick={() => setF({ q: "", location: "", category: "", min: "", max: "", rating: "", verifiedOnly: false, mode: "", avail: "" })}>Clear All</Button>
    </div>
  );

  return (
    <div className="flex gap-6">
      <aside className="hidden w-64 shrink-0 rounded-[16px] border border-[#E2E8F0] bg-white p-5 lg:block">{filterBody}</aside>
      {drawer && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setDrawer(false)} />
          <div className="absolute left-0 top-0 h-full w-80 overflow-y-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">Filters</h3><button onClick={() => setDrawer(false)} aria-label="Close filters"><X className="h-5 w-5" /></button></div>
            {filterBody}
          </div>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 rounded-[16px] border border-[#E2E8F0] bg-white p-3 sm:flex-row">
          <Input placeholder="Keyword (e.g. AC Repair)" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} />
          <Input placeholder="City or area" value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} />
          <Button onClick={() => { const p = new URLSearchParams(); if (f.q) p.set("q", f.q); if (f.location) p.set("location", f.location); router.push(`/search?${p.toString()}`); }}>Search</Button>
        </div>
        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((c, i) => (
              <button key={i} onClick={c.clear} className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-medium text-[#2563EB]">
                {c.label} <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
        <div className="mt-3 flex items-center gap-2">
          <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setDrawer(true)}><SlidersHorizontal className="h-4 w-4" /> Filters</Button>
          <p className="text-sm text-[#64748B]"><strong className="text-[#0F172A]">{results.length}</strong> results</p>
          <div className="ml-auto flex items-center gap-2">
            <Select value={sort} onChange={(e) => setSort(e.target.value)} className="!w-auto text-[13px]">
              <option value="recommended">Recommended</option><option value="rating">Highest Rated</option>
              <option value="low">Price: Low to High</option><option value="high">Price: High to Low</option>
              <option value="reviewed">Most Reviewed</option>
            </Select>
            <div className="hidden rounded-[10px] border border-[#E2E8F0] p-0.5 sm:flex">
              <button onClick={() => setView("grid")} aria-label="Grid view" className={`rounded-lg p-1.5 ${view === "grid" ? "bg-slate-100" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
              <button onClick={() => setView("list")} aria-label="List view" className={`rounded-lg p-1.5 ${view === "list" ? "bg-slate-100" : ""}`}><List className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
        {results.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No services match your filters" desc="Try widening the price range, removing the location, or clearing verified-only." action={<Button variant="outline" onClick={() => setF({ q: "", location: "", category: "", min: "", max: "", rating: "", verifiedOnly: false, mode: "", avail: "" })}>Clear all filters</Button>} />
          </div>
        ) : (
          <>
            <div className={`mt-4 grid gap-4 ${view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
              {results.slice(0, visible).map((s) => {
                const p = providers.find((x) => x.id === s.providerId);
                return <ServiceCard key={s.id} service={s} providerName={p?.name} providerAvatar={p?.avatar} verified={s.verified} />;
              })}
            </div>
            {visible < results.length && (
              <div className="mt-6 text-center">
                <Button variant="outline" onClick={() => setVisible((v) => v + 9)}>Load More ({results.length - visible} remaining)</Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

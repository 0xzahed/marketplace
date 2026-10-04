"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dhakaAreas } from "@/data/seed";

export const SUGGESTED = ["AC Repair", "Home Cleaning", "Plumbing", "Electrical", "Photography", "Web Development"];

export function SearchBar({ large }: { large?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const go = () => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (loc) p.set("location", loc);
    router.push(`/search?${p.toString()}`);
  };
  return (
    <div>
      <div className={`flex flex-col gap-2 rounded-[16px] border border-[#E2E8F0] bg-white p-2 shadow-sm sm:flex-row ${large ? "sm:p-2" : ""}`}>
        <label className="flex flex-1 items-center gap-2 rounded-[10px] px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-[#64748B]" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
            placeholder="What service do you need?"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#94A3B8]"
            aria-label="Service search"
          />
        </label>
        <div className="hidden w-px bg-[#E2E8F0] sm:block" />
        <label className="flex flex-1 items-center gap-2 rounded-[10px] px-3 py-2">
          <MapPin className="h-4 w-4 shrink-0 text-[#64748B]" />
          <input
            value={loc} onChange={(e) => setLoc(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
            placeholder="Enter city or area"
            list="fixora-areas"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#94A3B8]"
            aria-label="Location"
          />
          <datalist id="fixora-areas">{dhakaAreas.map((a) => <option key={a} value={a} />)}</datalist>
        </label>
        <Button size="lg" onClick={go} className="shrink-0">Search</Button>
      </div>
      {large && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
          <span className="text-[#64748B]">Suggested:</span>
          {SUGGESTED.map((s) => (
            <button key={s} onClick={() => router.push(`/search?q=${encodeURIComponent(s)}`)} className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-[13px] hover:border-[#2563EB] hover:text-[#2563EB]">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

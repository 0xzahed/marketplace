"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingDisplay({ value, count, className }: { value: number; count?: number; className?: string }) {
  const full = Math.floor(value);
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", className)}>
      <span className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={cn("h-3.5 w-3.5", i < full ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200")} />
        ))}
      </span>
      <span className="font-semibold text-[#0F172A]">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-[#64748B]">({count})</span>}
    </span>
  );
}

export function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="p-1"
          aria-label={`${s} star`}
        >
          <Star className={cn("h-7 w-7", (hover || value) >= s ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200")} />
        </button>
      ))}
    </div>
  );
}

export function Avatar({ src, name, size = 40 }: { src?: string; name: string; size?: number }) {
  const [err, setErr] = useState(false);
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  if (!src || err) {
    return (
      <span className="inline-flex items-center justify-center rounded-full bg-[#EFF6FF] font-semibold text-[#2563EB]" style={{ width: size, height: size, fontSize: size * 0.36 }}>
        {initials}
      </span>
    );
  }
  return <img src={src} alt={name} width={size} height={size} onError={() => setErr(true)} className="rounded-full object-cover" style={{ width: size, height: size }} />;
}

export function SmartImage({ src, alt, className, seed }: { src: string; alt: string; className?: string; seed?: string }) {
  const [err, setErr] = useState(false);
  const fallback = `https://picsum.photos/seed/${seed ?? "fixora"}/800/500`;
  return <img src={err ? fallback : src} alt={alt} onError={() => setErr(true)} className={className} loading="lazy" />;
}

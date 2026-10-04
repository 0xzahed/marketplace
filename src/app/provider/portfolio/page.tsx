"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ProviderShell, useMyProvider } from "@/app/provider/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { useConfirm } from "@/components/ui/confirm";
import { SmartImage } from "@/components/ui/rating";

export default function PortfolioPage() {
  const me = useMyProvider();
  const update = useApp((s) => s.updateProvider);
  const { toast } = useToast();
  const { ask, dialog } = useConfirm();
  const [preview, setPreview] = useState<string | null>(null);

  const add = (file: File | undefined) => {
    if (!file || !me) return;
    const url = URL.createObjectURL(file);
    update(me.id, { portfolio: [...me.portfolio, url] });
    toast({ title: "Photo added (local preview)", kind: "success" });
  };

  return (
    <ProviderShell title="Portfolio" breadcrumb={["Provider", "Portfolio"]}>
      <Card className="p-5">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white">
          <Plus className="h-4 w-4" /> Add Photos
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { Array.from(e.target.files ?? []).slice(0, 6).forEach(add); e.target.value = ""; }} />
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(me?.portfolio ?? []).map((img, i) => (
            <div key={i} className="group relative">
              <button onClick={() => setPreview(img)} className="block w-full">
                <SmartImage src={img} alt={`Work ${i + 1}`} seed={`${me?.id}-${i}`} className="h-40 w-full rounded-[12px] object-cover" />
              </button>
              <button
                aria-label="Remove photo"
                onClick={() => ask({ title: "Remove photo?", danger: true, confirmLabel: "Remove", onConfirm: () => { if (me) update(me.id, { portfolio: me.portfolio.filter((_, x) => x !== i) }); } })}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
        {(me?.portfolio ?? []).length === 0 && <p className="mt-2 text-sm text-[#64748B]">No portfolio images yet.</p>}
      </Card>
      {preview && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/70 p-4" onClick={() => setPreview(null)}>
          <img src={preview} alt="Preview" className="max-h-[85vh] rounded-[16px]" />
        </div>
      )}
      {dialog}
    </ProviderShell>
  );
}

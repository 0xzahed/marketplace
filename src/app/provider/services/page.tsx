"use client";
import Link from "next/link";
import { Plus, Eye, Pencil, Copy, Power, Trash2 } from "lucide-react";
import { ProviderShell, useMyProvider } from "@/app/provider/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toaster";
import { useConfirm } from "@/components/ui/confirm";
import { bdt } from "@/lib/formatters";
import { uid, slugify } from "@/lib/utils";

export default function ProviderServices() {
  const me = useMyProvider();
  const services = useApp((s) => s.services);
  const addService = useApp((s) => s.addService);
  const updateService = useApp((s) => s.updateService);
  const deleteService = useApp((s) => s.deleteService);
  const { toast } = useToast();
  const { ask, dialog } = useConfirm();
  const mine = services.filter((s) => s.providerId === me?.id);

  return (
    <ProviderShell title="My Services" breadcrumb={["Provider", "Services"]}>
      <div className="mb-4 flex justify-end">
        <Link href="/provider/services/new"><Button><Plus className="h-4 w-4" /> Create Service</Button></Link>
      </div>
      {mine.length === 0 ? (
        <EmptyState title="No services yet" desc="Publish your first service to start receiving bookings." action={<Link href="/provider/services/new"><Button>Create Service</Button></Link>} />
      ) : (
        <div className="grid gap-3">
          {mine.map((s) => (
            <Card key={s.id} className="flex flex-wrap items-center gap-3 p-4">
              <img src={s.images[0]} alt={s.title} className="h-16 w-24 rounded-[10px] object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{s.title}</p>
                <p className="text-[13px] text-[#64748B]">{s.pricingModel} · {bdt(s.startingPrice)} · ★ {s.rating} ({s.reviewCount})</p>
              </div>
              <Badge className={s.status === "Published" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}>{s.status}</Badge>
              <div className="flex flex-wrap gap-1.5">
                <Link href={`/services/${s.slug}`}><Button size="sm" variant="ghost"><Eye className="h-3.5 w-3.5" /> Preview</Button></Link>
                <Link href={`/provider/services/${s.id}/edit`}><Button size="sm" variant="outline"><Pencil className="h-3.5 w-3.5" /> Edit</Button></Link>
                <Button size="sm" variant="outline" onClick={() => {
                  const copy = { ...s, id: uid("s"), slug: `${s.slug}-copy-${Date.now().toString(36)}`, title: `${s.title} (Copy)`, status: "Draft" as const };
                  addService(copy);
                  toast({ title: "Duplicated as draft", kind: "success" });
                }}><Copy className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="outline" onClick={() => {
                  updateService(s.id, { status: s.status === "Published" ? "Unpublished" : "Published" });
                  toast({ title: s.status === "Published" ? "Unpublished" : "Published", kind: "success" });
                }}><Power className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" onClick={() => ask({ title: "Delete service?", desc: `"${s.title}" will be removed from the demo catalog.`, danger: true, confirmLabel: "Delete", onConfirm: () => { deleteService(s.id); toast({ title: "Deleted", kind: "success" }); } })}>
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {dialog}
    </ProviderShell>
  );
}

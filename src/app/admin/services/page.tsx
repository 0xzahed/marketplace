"use client";
import { useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/app/admin/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";
import { useConfirm } from "@/components/ui/confirm";
import { bdt } from "@/lib/formatters";

export default function AdminServices() {
  const services = useApp((s) => s.services);
  const providers = useApp((s) => s.providers);
  const update = useApp((s) => s.updateService);
  const del = useApp((s) => s.deleteService);
  const { toast } = useToast();
  const { ask, dialog } = useConfirm();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const list = services.filter((s) =>
    (!q || s.title.toLowerCase().includes(q.toLowerCase())) && (!status || s.status === status)
  );

  return (
    <AdminShell title="Service Listings" breadcrumb={["Admin", "Services"]}>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Search listings…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-48">
          <option value="">All states</option><option>Published</option><option>Pending</option><option>Rejected</option><option>Draft</option><option>Unpublished</option>
        </Select>
      </div>
      <div className="grid gap-2.5">
        {list.map((s) => (
          <Card key={s.id} className="flex flex-wrap items-center gap-3 p-3.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{s.title}</p>
              <p className="text-xs text-[#64748B]">{providers.find((p) => p.id === s.providerId)?.name} · {bdt(s.startingPrice)}</p>
            </div>
            <Badge className="bg-slate-100 text-slate-700">{s.status}</Badge>
            <div className="flex flex-wrap gap-1.5">
              {s.status !== "Published" && <Button size="sm" onClick={() => { update(s.id, { status: "Published", verified: true }); toast({ title: "Listing approved & published", kind: "success" }); }}>Approve</Button>}
              {s.status === "Published" && <Button size="sm" variant="outline" onClick={() => { update(s.id, { status: "Unpublished" }); toast({ title: "Unpublished", kind: "success" }); }}>Unpublish</Button>}
              <Button size="sm" variant="outline" onClick={() => { update(s.id, { status: "Rejected" }); toast({ title: "Rejected with reason (demo): needs clearer pricing", kind: "success" }); }}>Reject</Button>
              <Link href={`/services/${s.slug}`}><Button size="sm" variant="ghost">View</Button></Link>
              <Button size="sm" variant="ghost" onClick={() => ask({ title: "Remove listing?", danger: true, confirmLabel: "Remove", onConfirm: () => { del(s.id); toast({ title: "Removed", kind: "success" }); } })}>Remove</Button>
            </div>
          </Card>
        ))}
      </div>
      {dialog}
    </AdminShell>
  );
}

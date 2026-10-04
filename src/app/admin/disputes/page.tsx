"use client";
import { useState } from "react";
import { AdminShell } from "@/app/admin/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea, Select } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";
import type { Dispute } from "@/types";

export default function DisputesPage() {
  const disputes = useApp((s) => s.disputes);
  const update = useApp((s) => s.updateDispute);
  const { toast } = useToast();
  const [sel, setSel] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Dispute["status"]>("Under Review");

  return (
    <AdminShell title="Disputes" breadcrumb={["Admin", "Disputes"]}>
      <div className="grid gap-3">
        {disputes.map((d) => (
          <Card key={d.id} className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{d.reference}</p>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">{d.status}</span>
              <span className="ml-auto text-xs text-[#64748B]">Booking {d.bookingId}</span>
            </div>
            <p className="mt-1 text-sm"><strong>{d.reason}:</strong> {d.description}</p>
            <p className="mt-1 text-[13px] text-[#64748B]">Evidence: placeholder screenshots / chat excerpts (demo).</p>
            {d.adminNotes && <p className="mt-1 rounded-lg bg-slate-50 p-2 text-[13px]">Admin notes: {d.adminNotes}</p>}
            <Button size="sm" variant="outline" className="mt-2" onClick={() => setSel(sel === d.id ? null : d.id)}>{sel === d.id ? "Close" : "Resolve"}</Button>
            {sel === d.id && (
              <div className="mt-2 rounded-[10px] bg-slate-50 p-3">
                <Select value={status} onChange={(e) => setStatus(e.target.value as Dispute["status"])}>
                  <option>Open</option><option>Under Review</option><option>Awaiting Information</option><option>Resolved</option><option>Closed</option>
                </Select>
                <Textarea placeholder="Resolution notes…" value={notes} onChange={(e) => setNotes(e.target.value)} />
                <Button size="sm" className="mt-2" onClick={() => { update(d.id, { status, adminNotes: notes }); toast({ title: `Dispute ${status.toLowerCase()} (demo)`, kind: "success" }); setSel(null); setNotes(""); }}>Save Resolution</Button>
              </div>
            )}
          </Card>
        ))}
        {disputes.length === 0 && <Card className="p-8 text-center text-sm text-[#64748B]">No disputes.</Card>}
      </div>
    </AdminShell>
  );
}

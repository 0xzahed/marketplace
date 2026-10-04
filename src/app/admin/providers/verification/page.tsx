"use client";
import { useState } from "react";
import { AdminShell } from "@/app/admin/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Avatar } from "@/components/ui/rating";
import { EmptyState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toaster";

export default function VerificationQueue() {
  const providers = useApp((s) => s.providers);
  const update = useApp((s) => s.updateProvider);
  const notify = useApp((s) => s.notify);
  const { toast } = useToast();
  const [sel, setSel] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const queue = providers.filter((p) => p.verificationStatus !== "Approved");

  const decide = (id: string, status: "Approved" | "Rejected" | "Needs Info") => {
    const p = providers.find((x) => x.id === id);
    update(id, { verificationStatus: status });
    if (p) notify({ userId: p.userId, type: "verification", title: `Verification ${status.toLowerCase()}`, body: note || `Your application was ${status.toLowerCase()} (demo).`, link: "/provider/verification" });
    toast({ title: `Provider ${status}`, kind: "success" });
    setSel(null); setNote("");
  };

  return (
    <AdminShell title="Provider Verification" breadcrumb={["Admin", "Providers", "Verification"]}>
      {queue.length === 0 ? <EmptyState title="Queue is clear" desc="All providers verified." /> : (
        <div className="grid gap-3">
          {queue.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <Avatar src={p.avatar} name={p.name} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{p.name} <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">{p.verificationStatus}</span></p>
                  <p className="text-[13px] text-[#64748B]">{p.profession} · {p.location} · {p.experienceYears} yrs</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast({ title: "Document preview (demo)", desc: "NID + trade license placeholders.", kind: "info" })}>Preview Docs</Button>
                <Button size="sm" variant="outline" onClick={() => setSel(sel === p.id ? null : p.id)}>{sel === p.id ? "Close" : "Review"}</Button>
              </div>
              {sel === p.id && (
                <div className="mt-3 rounded-[10px] bg-slate-50 p-3">
                  <p className="text-[13px] text-[#64748B]">Submitted: NID ✓ · Photo ✓ · Trade proof {p.verificationStatus === "Needs Info" ? "✗ missing" : "✓"}</p>
                  <Textarea placeholder="Reason / feedback / info request…" value={note} onChange={(e) => setNote(e.target.value)} />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => decide(p.id, "Approved")}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => decide(p.id, "Needs Info")}>Request Info</Button>
                    <Button size="sm" variant="danger" onClick={() => { if (!note.trim()) { toast({ title: "Reason required for rejection", kind: "error" }); return; } decide(p.id, "Rejected"); }}>Reject with Reason</Button>
                  </div>
                  <p className="mt-1 text-[11px] text-[#94A3B8]">Approval updates the public Verified badge; it does not auto-approve listings.</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

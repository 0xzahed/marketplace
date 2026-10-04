"use client";
import { useState } from "react";
import { AdminShell } from "@/app/admin/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { RatingDisplay } from "@/components/ui/rating";
import { useToast } from "@/components/ui/toaster";

export default function AdminReviews() {
  const reviews = useApp((s) => s.reviews);
  const moderate = useApp((s) => s.moderateReview);
  const { toast } = useToast();
  const [f, setF] = useState("");
  const list = reviews.filter((r) => !f || (f === "reported" ? r.status === "reported" : String(r.rating) === f));
  return (
    <AdminShell title="Review Moderation" breadcrumb={["Admin", "Reviews"]}>
      <div className="mb-3">
        <Select value={f} onChange={(e) => setF(e.target.value)} className="sm:w-56">
          <option value="">All reviews</option><option value="5">5 stars</option><option value="4">4 stars</option><option value="reported">Reported</option>
        </Select>
      </div>
      <div className="grid gap-2.5">
        {list.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <RatingDisplay value={r.rating} />
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px]">{r.status}</span>
              <span className="ml-auto text-xs text-[#64748B]">{r.customerName}</span>
            </div>
            <p className="mt-1.5 text-sm">{r.text}</p>
            <div className="mt-2 flex gap-1.5">
              {r.status !== "hidden" ? (
                <Button size="sm" variant="outline" onClick={() => { moderate(r.id, "hidden"); toast({ title: "Review hidden — reason logged (demo)", kind: "success" }); }}>Hide</Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => { moderate(r.id, "published"); toast({ title: "Review restored", kind: "success" }); }}>Restore</Button>
              )}
              {r.status === "reported" && <Button size="sm" onClick={() => { moderate(r.id, "published"); toast({ title: "Report dismissed", kind: "success" }); }}>Dismiss Report</Button>}
            </div>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}

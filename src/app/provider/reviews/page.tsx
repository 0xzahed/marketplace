"use client";
import { useState } from "react";
import { ProviderShell, useMyProvider } from "@/app/provider/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { RatingDisplay, Avatar } from "@/components/ui/rating";
import { EmptyState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toaster";

export default function ProviderReviews() {
  const me = useMyProvider();
  const reviews = useApp((s) => s.reviews);
  const reply = useApp((s) => s.replyReview);
  const { toast } = useToast();
  const [open, setOpen] = useState<string | null>(null);
  const [text, setText] = useState("");
  const mine = reviews.filter((r) => r.providerId === me?.id);
  const dist = [5, 4, 3, 2, 1].map((s) => ({ s, n: mine.filter((r) => r.rating === s).length }));

  return (
    <ProviderShell title="Reviews" breadcrumb={["Provider", "Reviews"]}>
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit p-5">
          <p className="text-4xl font-extrabold">{me?.rating.toFixed(1)}</p>
          <RatingDisplay value={me?.rating ?? 0} count={me?.reviewCount} />
          <div className="mt-3 space-y-1.5">
            {dist.map((d) => (
              <div key={d.s} className="flex items-center gap-2 text-xs">
                <span className="w-6">{d.s}★</span>
                <div className="h-2 flex-1 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-amber-400" style={{ width: `${mine.length ? (d.n / mine.length) * 100 : 0}%` }} /></div>
                <span className="w-6 text-right text-[#64748B]">{d.n}</span>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-3">
          {mine.length === 0 && <EmptyState title="No reviews yet" />}
          {mine.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-center gap-2">
                <Avatar src={r.customerAvatar} name={r.customerName} size={36} />
                <div><p className="text-sm font-medium">{r.customerName}</p><RatingDisplay value={r.rating} /></div>
              </div>
              <p className="mt-2 text-sm">{r.text}</p>
              {r.reply ? (
                <p className="mt-2 rounded-lg bg-slate-50 p-2.5 text-[13px]"><strong>Your reply:</strong> {r.reply.text}</p>
              ) : (
                <>
                  {open === r.id ? (
                    <div className="mt-2">
                      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a professional reply…" />
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" onClick={() => { if (!text.trim()) return; reply(r.id, text.trim()); setOpen(null); setText(""); toast({ title: "Reply posted (demo)", kind: "success" }); }}>Post Reply</Button>
                        <Button size="sm" variant="ghost" onClick={() => setOpen(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" className="mt-2" onClick={() => setOpen(r.id)}>Reply</Button>
                  )}
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
    </ProviderShell>
  );
}

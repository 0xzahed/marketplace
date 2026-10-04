"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CustomerShell } from "@/app/customer/shell";
import { useApp } from "@/store/app-store";
import { useAuth } from "@/features/auth/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { StarInput, RatingDisplay, Avatar } from "@/components/ui/rating";
import { EmptyState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toaster";
import { fmtDate } from "@/lib/formatters";

function ReviewsInner() {
  const params = useSearchParams();
  const preselect = params.get("booking");
  const { user } = useAuth();
  const bookings = useApp((s) => s.bookings);
  const reviews = useApp((s) => s.reviews);
  const services = useApp((s) => s.services);
  const addReview = useApp((s) => s.addReview);
  const { toast } = useToast();
  const [bookingId, setBookingId] = useState(preselect ?? "");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const eligible = user ? bookings.filter((b) => b.customerId === user.id && b.bookingStatus === "Completed" && !b.reviewLeft) : [];
  const mine = user ? reviews.filter((r) => r.customerId === user.id) : [];

  const submit = () => {
    const b = bookings.find((x) => x.id === bookingId);
    if (!b) { toast({ title: "Select a booking", kind: "error" }); return; }
    if (b.reviewLeft || reviews.some((r) => r.bookingId === b.id)) { toast({ title: "Already reviewed", desc: "One review per booking.", kind: "error" }); return; }
    if (text.trim().length < 10) { toast({ title: "Write a bit more", desc: "Minimum 10 characters.", kind: "error" }); return; }
    addReview({ bookingId: b.id, serviceId: b.serviceId, providerId: b.providerId, customerId: b.customerId, customerName: user?.name ?? "Customer", customerAvatar: user?.avatar ?? "", rating, text: text.trim() });
    toast({ title: "Review submitted", desc: "Thanks for your feedback (demo).", kind: "success" });
    setBookingId(""); setText(""); setRating(5);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card className="h-fit p-5">
        <h3 className="font-semibold">Write a review</h3>
        <p className="mt-1 text-[13px] text-[#64748B]">Only eligible completed bookings. One review each.</p>
        {eligible.length === 0 ? (
          <p className="mt-3 rounded-[10px] bg-slate-50 p-3 text-[13px] text-[#64748B]">No eligible bookings right now — complete a service first.</p>
        ) : (
          <div className="mt-3 space-y-3">
            <select value={bookingId} onChange={(e) => setBookingId(e.target.value)} className="h-10 w-full rounded-[10px] border border-[#E2E8F0] px-3 text-sm">
              <option value="">Select booking…</option>
              {eligible.map((b) => <option key={b.id} value={b.id}>{b.reference} · {services.find((s) => s.id === b.serviceId)?.title}</option>)}
            </select>
            <StarInput value={rating} onChange={setRating} />
            <Textarea placeholder="How was the service?" value={text} onChange={(e) => setText(e.target.value)} />
            <Button className="w-full" onClick={submit}>Submit Review</Button>
          </div>
        )}
      </Card>
      <div className="space-y-3">
        <h3 className="font-semibold">My reviews ({mine.length})</h3>
        {mine.length === 0 && <EmptyState title="No reviews yet" />}
        {mine.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex items-center gap-2">
              <RatingDisplay value={r.rating} />
              <span className="ml-auto text-xs text-[#64748B]">{fmtDate(r.date)} · {r.status}</span>
            </div>
            <p className="mt-2 text-sm">{r.text}</p>
            {r.reply && <p className="mt-2 rounded-lg bg-slate-50 p-2.5 text-[13px]"><strong>Provider:</strong> {r.reply.text}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <CustomerShell title="Reviews" breadcrumb={["Customer", "Reviews"]}>
      <Suspense fallback={<p className="text-sm text-[#64748B]">Loading…</p>}>
        <ReviewsInner />
      </Suspense>
    </CustomerShell>
  );
}

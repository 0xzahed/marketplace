"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CustomerShell } from "@/app/customer/shell";
import { useApp } from "@/store/app-store";
import { useAuth } from "@/features/auth/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/states";
import { Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";
import { useConfirm } from "@/components/ui/confirm";
import { bdt, fmtDate } from "@/lib/formatters";
import type { BookingStatus } from "@/types";

const TABS: ("All" | BookingStatus)[] = ["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];

export default function CustomerBookings() {
  const { user } = useAuth();
  const bookings = useApp((s) => s.bookings);
  const services = useApp((s) => s.services);
  const providers = useApp((s) => s.providers);
  const updateStatus = useApp((s) => s.updateBookingStatus);
  const notify = useApp((s) => s.notify);
  const { toast } = useToast();
  const { ask, dialog } = useConfirm();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const mine = user ? bookings.filter((b) => b.customerId === user.id) : [];
  const list = tab === "All" ? mine : mine.filter((b) => b.bookingStatus === tab || (tab === "Cancelled" && b.bookingStatus === "Declined"));

  const doCancel = () => {
    if (!cancelId) return;
    if (!reason.trim()) { toast({ title: "Reason required", desc: "Please tell the provider why.", kind: "error" }); return; }
    const b = bookings.find((x) => x.id === cancelId);
    updateStatus(cancelId, "Cancelled", { cancelReason: reason });
    if (b) notify({ userId: providers.find((p) => p.id === b.providerId)?.userId ?? "", type: "booking_cancelled", title: "Booking cancelled", body: `${b.reference} cancelled by customer.`, link: "/provider/bookings" });
    toast({ title: "Booking cancelled", desc: "Refund (if paid) moves to Refund Pending — demo.", kind: "success" });
    setCancelId(null); setReason("");
  };

  return (
    <CustomerShell title="My Bookings" breadcrumb={["Customer", "Bookings"]}>
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium ${tab === t ? "bg-[#0F172A] text-white" : "bg-white text-[#475569] border border-[#E2E8F0]"}`}>
            {t} ({t === "All" ? mine.length : mine.filter((b) => b.bookingStatus === t).length})
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="mt-4"><EmptyState title={`No ${tab.toLowerCase()} bookings`} desc="Browse services and book your first job." action={<Link href="/services"><Button>Find Services</Button></Link>} /></div>
      ) : (
        <div className="mt-4 grid gap-3">
          {list.map((b) => {
            const sv = services.find((s) => s.id === b.serviceId);
            const pv = providers.find((p) => p.id === b.providerId);
            const cancellable = ["Pending", "Confirmed"].includes(b.bookingStatus);
            const reviewable = b.bookingStatus === "Completed" && !b.reviewLeft;
            return (
              <Card key={b.id} className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{sv?.title} <span className="font-normal text-[#64748B]">· {b.reference}</span></p>
                    <p className="mt-0.5 text-[13px] text-[#64748B]">{pv?.name} · {fmtDate(b.date)} at {b.timeSlot} · {bdt(b.price.total)}</p>
                  </div>
                  <BookingStatusBadge status={b.bookingStatus} />
                  <PaymentStatusBadge status={b.paymentStatus} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href={`/customer/bookings/${b.id}`}><Button size="sm" variant="outline">View Details</Button></Link>
                  {cancellable && <Button size="sm" variant="danger" onClick={() => ask({ title: "Cancel booking?", desc: `${b.reference} will be cancelled. Paid amounts move to Refund Pending (demo).`, confirmLabel: "Yes, cancel", danger: true, onConfirm: () => setCancelId(b.id) })}>Cancel Booking</Button>}
                  {reviewable && <Link href={`/customer/reviews?booking=${b.id}`}><Button size="sm">Leave Review</Button></Link>}
                  <Button size="sm" variant="ghost" onClick={() => router.push("/customer/messages")}>Message Provider</Button>
                </div>
                {cancelId === b.id && (
                  <div className="mt-3 rounded-[10px] bg-slate-50 p-3">
                    <Textarea placeholder="Cancellation reason…" value={reason} onChange={(e) => setReason(e.target.value)} />
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="danger" onClick={doCancel}>Confirm Cancel</Button>
                      <Button size="sm" variant="ghost" onClick={() => setCancelId(null)}>Keep Booking</Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
      {dialog}
    </CustomerShell>
  );
}

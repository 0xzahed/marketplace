"use client";
import { useState } from "react";
import Link from "next/link";
import { ProviderShell, useMyProvider } from "@/app/provider/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/states";
import { Avatar } from "@/components/ui/rating";
import { Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";
import { bdt, fmtDate } from "@/lib/formatters";
import type { BookingStatus } from "@/types";

const TABS: ("All" | BookingStatus)[] = ["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];

export default function ProviderBookings() {
  const me = useMyProvider();
  const bookings = useApp((s) => s.bookings);
  const users = useApp((s) => s.users);
  const services = useApp((s) => s.services);
  const updateStatus = useApp((s) => s.updateBookingStatus);
  const notify = useApp((s) => s.notify);
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [declineId, setDeclineId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const mine = bookings.filter((b) => b.providerId === me?.id);
  const list = tab === "All" ? mine : mine.filter((b) => b.bookingStatus === tab || (tab === "Cancelled" && ["Cancelled", "Declined"].includes(b.bookingStatus)));

  const act = (id: string, status: BookingStatus, extra?: object) => {
    const b = bookings.find((x) => x.id === id);
    if (!b) return;
    // conflict guard when accepting
    if (status === "Confirmed") {
      const clash = bookings.some((x) => x.id !== id && x.providerId === b.providerId && x.date === b.date && x.timeSlot === b.timeSlot && ["Confirmed", "In Progress"].includes(x.bookingStatus));
      if (clash) { toast({ title: "Time conflict", desc: "Another accepted booking occupies this slot.", kind: "error" }); return; }
    }
    updateStatus(id, status, extra as never);
    notify({ userId: b.customerId, type: status === "Confirmed" ? "booking_confirmed" : "booking_cancelled", title: `Booking ${status.toLowerCase()}`, body: `${b.reference} is now ${status}.`, link: `/customer/bookings/${b.id}` });
    toast({ title: `Booking ${status}`, kind: "success" });
  };

  return (
    <ProviderShell title="Bookings" breadcrumb={["Provider", "Bookings"]}>
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium ${tab === t ? "bg-[#0F172A] text-white" : "border border-[#E2E8F0] bg-white"}`}>{t}</button>
        ))}
      </div>
      {list.length === 0 ? <div className="mt-4"><EmptyState title={`No ${tab.toLowerCase()} bookings`} /></div> : (
        <div className="mt-4 grid gap-3">
          {list.map((b) => {
            const cu = users.find((u) => u.id === b.customerId);
            const sv = services.find((s) => s.id === b.serviceId);
            return (
              <Card key={b.id} className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Avatar src={cu?.avatar} name={cu?.name ?? "?"} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{cu?.name} · {sv?.title}</p>
                    <p className="text-[13px] text-[#64748B]">{b.reference} · {fmtDate(b.date)} {b.timeSlot} · {bdt(b.price.total)}</p>
                  </div>
                  <BookingStatusBadge status={b.bookingStatus} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href={`/provider/bookings/${b.id}`}><Button size="sm" variant="outline">Details</Button></Link>
                  {b.bookingStatus === "Pending" && (
                    <>
                      <Button size="sm" onClick={() => act(b.id, "Confirmed")}>Accept</Button>
                      <Button size="sm" variant="danger" onClick={() => setDeclineId(b.id)}>Decline</Button>
                    </>
                  )}
                  {b.bookingStatus === "Confirmed" && <Button size="sm" onClick={() => act(b.id, "In Progress")}>Mark Started</Button>}
                  {b.bookingStatus === "In Progress" && <Button size="sm" onClick={() => act(b.id, "Completed")}>Mark Completed</Button>}
                </div>
                {declineId === b.id && (
                  <div className="mt-3 rounded-[10px] bg-slate-50 p-3">
                    <Textarea placeholder="Decline reason…" value={reason} onChange={(e) => setReason(e.target.value)} />
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="danger" onClick={() => { if (!reason.trim()) { toast({ title: "Reason required", kind: "error" }); return; } act(b.id, "Declined", { declineReason: reason }); setDeclineId(null); setReason(""); }}>Confirm Decline</Button>
                      <Button size="sm" variant="ghost" onClick={() => setDeclineId(null)}>Keep</Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </ProviderShell>
  );
}

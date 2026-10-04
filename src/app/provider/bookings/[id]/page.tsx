"use client";
import { use } from "react";
import Link from "next/link";
import { ProviderShell, useMyProvider } from "@/app/provider/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";
import { BookingTimeline } from "@/components/booking/timeline";
import { EmptyState } from "@/components/ui/states";
import { Avatar } from "@/components/ui/rating";
import { bdt, fmtDate } from "@/lib/formatters";
import { useToast } from "@/components/ui/toaster";

export default function ProviderBookingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const me = useMyProvider();
  const bookings = useApp((s) => s.bookings);
  const users = useApp((s) => s.users);
  const updateStatus = useApp((s) => s.updateBookingStatus);
  const { toast } = useToast();
  const b = bookings.find((x) => x.id === id && x.providerId === me?.id);
  if (!b) return <ProviderShell title="Booking" breadcrumb={["Provider", "Bookings"]}><EmptyState title="Booking not found or belongs to another provider" /></ProviderShell>;
  const cu = users.find((u) => u.id === b.customerId);
  return (
    <ProviderShell title={b.reference} breadcrumb={["Provider", "Bookings", b.reference]}>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex gap-2"><BookingStatusBadge status={b.bookingStatus} /><PaymentStatusBadge status={b.paymentStatus} /></div>
            <div className="mt-4"><BookingTimeline status={b.bookingStatus} cancelled={b.cancelReason ?? b.declineReason} /></div>
          </Card>
          <Card className="p-5 text-sm">
            <p><strong>Schedule:</strong> {fmtDate(b.date)} at {b.timeSlot}</p>
            <p className="mt-1"><strong>Address:</strong> {b.address.street}, {b.address.area}, {b.address.city} · {b.address.phone}</p>
            {b.address.notes && <p className="mt-1 text-[#64748B]">Notes: {b.address.notes}</p>}
            <p className="mt-2"><strong>Total:</strong> {bdt(b.price.total)} (net {bdt(b.price.providerNet)}) via {b.paymentMethod}</p>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="flex items-center gap-3 p-5">
            <Avatar src={cu?.avatar} name={cu?.name ?? "?"} size={44} />
            <div><p className="text-sm font-semibold">{cu?.name}</p><p className="text-xs text-[#64748B]">{cu?.phone}</p></div>
          </Card>
          <Card className="flex flex-col gap-2 p-5">
            {b.bookingStatus === "Pending" && (<><Button onClick={() => { updateStatus(b.id, "Confirmed"); toast({ title: "Accepted", kind: "success" }); }}>Accept</Button><Button variant="danger" onClick={() => { updateStatus(b.id, "Declined", { declineReason: "Unavailable (demo)" }); toast({ title: "Declined", kind: "success" }); }}>Decline</Button></>)}
            {b.bookingStatus === "Confirmed" && <Button onClick={() => { updateStatus(b.id, "In Progress"); toast({ title: "Started", kind: "success" }); }}>Mark Started</Button>}
            {b.bookingStatus === "In Progress" && <Button onClick={() => { updateStatus(b.id, "Completed"); toast({ title: "Completed", kind: "success" }); }}>Mark Completed</Button>}
            <Link href="/provider/messages"><Button variant="outline">Message Customer</Button></Link>
          </Card>
        </div>
      </div>
    </ProviderShell>
  );
}

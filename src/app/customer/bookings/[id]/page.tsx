"use client";
import { use } from "react";
import Link from "next/link";
import { CustomerShell } from "@/app/customer/shell";
import { useApp } from "@/store/app-store";
import { useAuth } from "@/features/auth/auth-context";
import { Card } from "@/components/ui/card";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";
import { BookingTimeline } from "@/components/booking/timeline";
import { Avatar } from "@/components/ui/rating";
import { EmptyState } from "@/components/ui/states";
import { bdt, fmtDate } from "@/lib/formatters";

export default function BookingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const bookings = useApp((s) => s.bookings);
  const services = useApp((s) => s.services);
  const providers = useApp((s) => s.providers);
  const b = bookings.find((x) => x.id === id && x.customerId === user?.id);
  if (!b) {
    return <CustomerShell title="Booking Details" breadcrumb={["Customer", "Bookings", "Details"]}><EmptyState title="Booking not found" /></CustomerShell>;
  }
  const sv = services.find((s) => s.id === b.serviceId);
  const pv = providers.find((p) => p.id === b.providerId);
  return (
    <CustomerShell title={b.reference} breadcrumb={["Customer", "Bookings", b.reference]}>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <BookingStatusBadge status={b.bookingStatus} />
              <PaymentStatusBadge status={b.paymentStatus} />
              <span className="ml-auto text-[13px] text-[#64748B]">{b.paymentMethod} · demo</span>
            </div>
            <div className="mt-4"><BookingTimeline status={b.bookingStatus} cancelled={b.cancelReason ?? b.declineReason} /></div>
          </Card>
          <Card className="p-5 text-sm">
            <h3 className="font-semibold">Service</h3>
            <p className="mt-1">{sv?.title} {b.packageName ? `· ${b.packageName}` : ""}</p>
            <h3 className="mt-4 font-semibold">Schedule</h3>
            <p className="mt-1 text-[#334155]">{fmtDate(b.date)} at {b.timeSlot}</p>
            <h3 className="mt-4 font-semibold">Address</h3>
            <p className="mt-1 text-[#334155]">{b.address.name} · {b.address.phone}<br />{b.address.street}, {b.address.area}, {b.address.city}{b.address.notes ? ` · ${b.address.notes}` : ""}</p>
            <h3 className="mt-4 font-semibold">Price breakdown</h3>
            <dl className="mt-1 space-y-1">
              <div className="flex justify-between"><dt className="text-[#64748B]">Subtotal</dt><dd>{bdt(b.price.subtotal + b.price.addonTotal)}</dd></div>
              {b.price.discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Discount{b.price.couponCode ? ` (${b.price.couponCode})` : ""}</dt><dd>−{bdt(b.price.discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-[#64748B]">Platform fee</dt><dd>{bdt(b.price.platformFee)}</dd></div>
              <div className="flex justify-between font-bold"><dt>Total</dt><dd>{bdt(b.price.total)}</dd></div>
            </dl>
          </Card>
        </div>
        <div>
          <Card className="flex items-center gap-3 p-5">
            <Avatar src={pv?.avatar} name={pv?.name ?? "?"} size={48} />
            <div className="flex-1">
              <p className="text-sm font-semibold">{pv?.name}</p>
              <p className="text-xs text-[#64748B]">{pv?.profession}</p>
              <Link href={`/providers/${pv?.id}`} className="text-xs font-medium text-[#2563EB]">View profile →</Link>
            </div>
          </Card>
          {b.bookingStatus === "Completed" && !b.reviewLeft && (
            <Card className="mt-4 p-5 text-sm">
              <p className="font-semibold">Enjoyed the service?</p>
              <Link href={`/customer/reviews?booking=${b.id}`} className="mt-2 inline-block rounded-[10px] bg-[#2563EB] px-4 py-2 text-sm font-medium text-white">Leave a Review</Link>
            </Card>
          )}
        </div>
      </div>
    </CustomerShell>
  );
}

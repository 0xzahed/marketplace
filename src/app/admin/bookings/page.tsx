"use client";
import { useState } from "react";
import { AdminShell } from "@/app/admin/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";
import { bdt, fmtDate } from "@/lib/formatters";

export default function AdminBookings() {
  const bookings = useApp((s) => s.bookings);
  const users = useApp((s) => s.users);
  const providers = useApp((s) => s.providers);
  const services = useApp((s) => s.services);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const list = bookings.filter((b) =>
    (!q || b.reference.toLowerCase().includes(q.toLowerCase())) && (!status || b.bookingStatus === status)
  );
  return (
    <AdminShell title="Bookings" breadcrumb={["Admin", "Bookings"]}>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Search reference…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-48">
          <option value="">All statuses</option><option>Pending</option><option>Confirmed</option><option>In Progress</option><option>Completed</option><option>Cancelled</option><option>Declined</option>
        </Select>
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead><tr className="bg-slate-50 text-xs text-[#64748B]">
            <th className="px-4 py-2.5">Reference</th><th className="px-4 py-2.5">Customer</th><th className="px-4 py-2.5">Provider</th><th className="px-4 py-2.5">Service</th><th className="px-4 py-2.5">Date</th><th className="px-4 py-2.5">Amount</th><th className="px-4 py-2.5">Booking</th><th className="px-4 py-2.5">Payment</th>
          </tr></thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.id} className="border-t border-[#E2E8F0]">
                <td className="px-4 py-2.5 font-medium">{b.reference}</td>
                <td className="px-4 py-2.5 text-[13px]">{users.find((u) => u.id === b.customerId)?.name}</td>
                <td className="px-4 py-2.5 text-[13px]">{providers.find((p) => p.id === b.providerId)?.name}</td>
                <td className="px-4 py-2.5 text-[13px]">{services.find((s) => s.id === b.serviceId)?.title}</td>
                <td className="px-4 py-2.5 text-[13px]">{fmtDate(b.date)} {b.timeSlot}</td>
                <td className="px-4 py-2.5 font-semibold">{bdt(b.price.total)}</td>
                <td className="px-4 py-2.5"><BookingStatusBadge status={b.bookingStatus} /></td>
                <td className="px-4 py-2.5"><PaymentStatusBadge status={b.paymentStatus} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  );
}

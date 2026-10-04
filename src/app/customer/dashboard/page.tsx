"use client";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, Heart, MessagesSquare, ArrowRight } from "lucide-react";
import { CustomerShell } from "@/app/customer/shell";
import { useApp } from "@/store/app-store";
import { useAuth } from "@/features/auth/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/ui/badge";
import { Avatar, RatingDisplay } from "@/components/ui/rating";
import { ServiceCard } from "@/components/marketplace/cards";
import { bdt, fmtDate, timeAgo } from "@/lib/formatters";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const bookings = useApp((s) => s.bookings);
  const services = useApp((s) => s.services);
  const providers = useApp((s) => s.providers);
  const saved = useApp((s) => s.savedServiceIds);
  const convs = useApp((s) => s.conversations);
  const notifs = useApp((s) => s.notifications);

  const mine = user ? bookings.filter((b) => b.customerId === user.id) : [];
  const upcoming = mine.filter((b) => ["Pending", "Confirmed", "In Progress"].includes(b.bookingStatus));
  const completed = mine.filter((b) => b.bookingStatus === "Completed");
  const unread = user ? convs.filter((c) => c.customerId === user.id).reduce((s, c) => s + c.unreadCustomer, 0) : 0;
  const myNotes = user ? notifs.filter((n) => n.userId === user.id).slice(0, 5) : [];
  const svcOf = (id: string) => services.find((s) => s.id === id);
  const provOf = (id: string) => providers.find((p) => p.id === id);
  const firstName = user?.name.split(" ")[0] ?? "there";

  const stats = [
    { label: "Upcoming Bookings", value: upcoming.length, icon: CalendarCheck, href: "/customer/bookings" },
    { label: "Completed Services", value: completed.length, icon: CheckCircle2, href: "/customer/bookings?tab=Completed" },
    { label: "Saved Services", value: saved.length, icon: Heart, href: "/customer/saved" },
    { label: "Unread Messages", value: unread, icon: MessagesSquare, href: "/customer/messages" },
  ];

  return (
    <CustomerShell title={`Welcome back, ${firstName}!`} breadcrumb={["Customer", "Overview"]}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="flex items-center gap-3 p-4 transition-shadow hover:shadow-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#EFF6FF] text-[#2563EB]"><s.icon className="h-5 w-5" /></span>
              <span><strong className="block text-xl">{s.value}</strong><span className="text-[13px] text-[#64748B]">{s.label}</span></span>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Upcoming bookings</h3>
              <Link href="/customer/bookings" className="inline-flex items-center gap-1 text-[13px] font-medium text-[#2563EB]">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="rounded-[12px] bg-slate-50 p-4 text-center text-sm text-[#64748B]">
                No upcoming bookings. <Link href="/services" className="font-medium text-[#2563EB]">Find a service →</Link>
              </div>
            ) : upcoming.slice(0, 3).map((b) => {
              const sv = svcOf(b.serviceId);
              const pv = provOf(b.providerId);
              return (
                <div key={b.id} className="flex flex-wrap items-center gap-3 rounded-[12px] border border-[#E2E8F0] p-3">
                  <Avatar src={pv?.avatar} name={pv?.name ?? "?"} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{sv?.title} · <span className="text-[#64748B]">{b.reference}</span></p>
                    <p className="text-xs text-[#64748B]">{fmtDate(b.date)} at {b.timeSlot} · {bdt(b.price.total)}</p>
                  </div>
                  <BookingStatusBadge status={b.bookingStatus} />
                  <Link href={`/customer/bookings/${b.id}`}><Button size="sm" variant="outline">View</Button></Link>
                </div>
              );
            })}
          </Card>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Recommended for you</h3>
              <Link href="/services" className="text-[13px] font-medium text-[#2563EB]">Browse all</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {services.filter((s) => s.status === "Published").slice(0, 2).map((s) => {
                const p = providers.find((x) => x.id === s.providerId);
                return <ServiceCard key={s.id} service={s} providerName={p?.name} providerAvatar={p?.avatar} verified={s.verified} />;
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold">Recent activity</h3>
            <ul className="mt-3 space-y-2.5">
              {myNotes.length === 0 && <li className="text-sm text-[#64748B]">No activity yet.</li>}
              {myNotes.map((n) => (
                <li key={n.id}>
                  <Link href={n.link} className="block rounded-[10px] bg-slate-50 p-2.5 hover:bg-[#EFF6FF]">
                    <p className="text-[13px] font-medium">{n.title}</p>
                    <p className="truncate text-xs text-[#64748B]">{n.body} · {timeAgo(n.at)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold">Top rated pros</h3>
            <div className="mt-3 space-y-2.5">
              {providers.filter((p) => p.verified).slice(0, 3).map((p) => (
                <Link key={p.id} href={`/providers/${p.id}`} className="flex items-center gap-2.5">
                  <Avatar src={p.avatar} name={p.name} size={36} />
                  <span className="flex-1 text-sm font-medium">{p.name}</span>
                  <RatingDisplay value={p.rating} />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </CustomerShell>
  );
}

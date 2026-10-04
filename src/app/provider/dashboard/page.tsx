"use client";
import Link from "next/link";
import { CalendarCheck, Clock, CheckCircle2, Wallet, Plus, ArrowRight } from "lucide-react";
import { ProviderShell, useMyProvider } from "@/app/provider/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/ui/badge";
import { Avatar, RatingDisplay } from "@/components/ui/rating";
import { bdt, fmtDate } from "@/lib/formatters";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ProviderDashboard() {
  const me = useMyProvider();
  const bookings = useApp((s) => s.bookings);
  const services = useApp((s) => s.services);
  const reviews = useApp((s) => s.reviews);
  const users = useApp((s) => s.users);

  const mine = bookings.filter((b) => b.providerId === me?.id);
  const today = new Date().toISOString().slice(0, 10);
  const todaysJobs = mine.filter((b) => b.date === today && !["Cancelled", "Declined"].includes(b.bookingStatus)).length;
  const pending = mine.filter((b) => b.bookingStatus === "Pending").length;
  const completed = mine.filter((b) => b.bookingStatus === "Completed").length;
  const earnings = mine.filter((b) => b.bookingStatus === "Completed").reduce((s, b) => s + b.price.providerNet, 0);
  const myServices = services.filter((s) => s.providerId === me?.id);
  const myReviews = reviews.filter((r) => r.providerId === me?.id && r.status === "published").slice(0, 3);
  const profilePct = Math.round(
    ([me?.about, me?.skills.length, me?.portfolio.length, myServices.length, me?.verified].filter(Boolean).length / 5) * 100
  );

  const chart = [
    { m: "Apr", v: 4200 }, { m: "May", v: 6800 }, { m: "Jun", v: 5400 },
    { m: "Jul", v: 8100 }, { m: "Aug", v: 7300 }, { m: "Sep", v: Math.round(earnings / 4) || 9200 },
  ];

  const stats = [
    { label: "Today's Jobs", value: todaysJobs, icon: CalendarCheck },
    { label: "Pending Requests", value: pending, icon: Clock },
    { label: "Completed Jobs", value: completed, icon: CheckCircle2 },
    { label: "Total Earnings", value: bdt(earnings), icon: Wallet },
  ];

  return (
    <ProviderShell title={`Hello, ${me?.name.split(" ")[0]}!`} breadcrumb={["Provider", "Overview"]}>
      {me && !me.verified && (
        <Card className="mb-4 border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Verification {me.verificationStatus}: complete your documents under <Link href="/provider/verification" className="font-semibold underline">Verification</Link>.
        </Card>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#EFF6FF] text-[#2563EB]"><s.icon className="h-5 w-5" /></span>
            <span><strong className="block text-xl">{s.value}</strong><span className="text-[13px] text-[#64748B]">{s.label}</span></span>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">Monthly earnings (demo)</h3>
              <Link href="/provider/earnings" className="inline-flex items-center gap-1 text-[13px] font-medium text-[#2563EB]">Details <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart}>
                  <XAxis dataKey="m" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [bdt(Number(v)), "Net"]} />
                  <Bar dataKey="v" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Recent booking requests</h3>
              <Link href="/provider/bookings" className="text-[13px] font-medium text-[#2563EB]">Manage all</Link>
            </div>
            {mine.length === 0 && <p className="text-sm text-[#64748B]">No bookings yet.</p>}
            {mine.slice(0, 3).map((b) => {
              const cu = users.find((u) => u.id === b.customerId);
              return (
                <div key={b.id} className="flex flex-wrap items-center gap-3 rounded-[12px] border border-[#E2E8F0] p-3">
                  <Avatar src={cu?.avatar} name={cu?.name ?? "?"} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{cu?.name} · {b.reference}</p>
                    <p className="text-xs text-[#64748B]">{fmtDate(b.date)} at {b.timeSlot} · {bdt(b.price.total)}</p>
                  </div>
                  <BookingStatusBadge status={b.bookingStatus} />
                  <Link href={`/provider/bookings/${b.id}`}><Button size="sm" variant="outline">Review</Button></Link>
                </div>
              );
            })}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold">Profile completion · {profilePct}%</h3>
            <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-[#2563EB]" style={{ width: `${profilePct}%` }} /></div>
            <Link href="/provider/services/new"><Button className="mt-4 w-full"><Plus className="h-4 w-4" /> Add a Service</Button></Link>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold">Recent reviews</h3>
            <div className="mt-3 space-y-2.5">
              {myReviews.length === 0 && <p className="text-sm text-[#64748B]">No reviews yet.</p>}
              {myReviews.map((r) => (
                <div key={r.id} className="rounded-[10px] bg-slate-50 p-2.5 text-[13px]">
                  <RatingDisplay value={r.rating} />
                  <p className="mt-1 line-clamp-2">{r.text}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold">Upcoming appointments</h3>
            <div className="mt-2 space-y-1.5 text-sm">
              {mine.filter((b) => ["Confirmed", "In Progress"].includes(b.bookingStatus)).slice(0, 3).map((b) => (
                <p key={b.id} className="rounded-lg bg-slate-50 px-3 py-2">{fmtDate(b.date)} · {b.timeSlot} · {b.reference}</p>
              )) || <p className="text-[13px] text-[#64748B]">Nothing scheduled.</p>}
            </div>
          </Card>
        </div>
      </div>
    </ProviderShell>
  );
}

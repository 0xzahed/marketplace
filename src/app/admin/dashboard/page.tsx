"use client";
import Link from "next/link";
import { Users, ShieldCheck, Briefcase, CalendarCheck, Wallet, Clock } from "lucide-react";
import { AdminShell } from "@/app/admin/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/rating";
import { bdt, fmtDate } from "@/lib/formatters";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminDashboard() {
  const users = useApp((s) => s.users);
  const providers = useApp((s) => s.providers);
  const services = useApp((s) => s.services);
  const bookings = useApp((s) => s.bookings);
  const disputes = useApp((s) => s.disputes);

  const customers = users.filter((u) => u.role === "customer").length;
  const pendingV = providers.filter((p) => p.verificationStatus === "Pending").length;
  const activeS = services.filter((s) => s.status === "Published").length;
  const revenue = bookings.reduce((s, b) => s + b.price.platformFee, 0);

  const stats = [
    { l: "Total Customers", v: customers, icon: Users },
    { l: "Total Providers", v: providers.length, icon: ShieldCheck },
    { l: "Pending Verifications", v: pendingV, icon: Clock },
    { l: "Active Services", v: activeS, icon: Briefcase },
    { l: "Total Bookings", v: bookings.length, icon: CalendarCheck },
    { l: "Platform Revenue", v: bdt(revenue), icon: Wallet },
  ];

  const trend = [
    { m: "Apr", b: 18, r: 9200 }, { m: "May", b: 26, r: 14100 }, { m: "Jun", b: 22, r: 11800 },
    { m: "Jul", b: 31, r: 17400 }, { m: "Aug", b: 28, r: 15900 }, { m: "Sep", b: bookings.length, r: revenue },
  ];
  const dist = ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"].map((s) => ({
    name: s, value: bookings.filter((b) => b.bookingStatus === s).length,
  }));
  const COLORS = ["#F59E0B", "#2563EB", "#8B5CF6", "#10B981", "#94A3B8"];

  return (
    <AdminShell title="Admin Dashboard" breadcrumb={["Admin", "Dashboard"]}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.l} className="p-4">
            <s.icon className="h-5 w-5 text-[#2563EB]" />
            <p className="mt-2 text-xl font-extrabold">{s.v}</p>
            <p className="text-xs text-[#64748B]">{s.l}</p>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="p-5">
          <h3 className="font-semibold">Booking activity & revenue (demo)</h3>
          <div className="mt-2 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <XAxis dataKey="m" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="b" fill="#2563EB" name="Bookings" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-1 text-xs text-[#64748B]">Gross booking value vs platform revenue distinguished in Reports.</p>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold">Booking status</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dist} dataKey="value" nameKey="name" outerRadius={70}>
                  {dist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-1 space-y-1 text-xs">
            {dist.map((d, i) => <li key={d.name} className="flex justify-between"><span><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />{d.name}</span><strong>{d.value}</strong></li>)}
          </ul>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <div className="mb-2 flex items-center justify-between"><h3 className="font-semibold">Recent bookings</h3><Link href="/admin/bookings" className="text-xs font-medium text-[#2563EB]">View all</Link></div>
          {bookings.slice(0, 4).map((b) => (
            <div key={b.id} className="flex items-center justify-between border-b border-slate-100 py-2 text-[13px] last:border-0">
              <span>{b.reference} · {bdt(b.price.total)}</span><BookingStatusBadge status={b.bookingStatus} />
            </div>
          ))}
        </Card>
        <Card className="p-5">
          <div className="mb-2 flex items-center justify-between"><h3 className="font-semibold">Pending approvals</h3><Link href="/admin/providers/verification" className="text-xs font-medium text-[#2563EB]">Review</Link></div>
          {providers.filter((p) => p.verificationStatus === "Pending").slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center gap-2 border-b border-slate-100 py-2 last:border-0">
              <Avatar src={p.avatar} name={p.name} size={30} />
              <span className="flex-1 text-[13px] font-medium">{p.name}</span>
              <Link href="/admin/providers/verification"><Button size="sm" variant="outline">Review</Button></Link>
            </div>
          ))}
        </Card>
        <Card className="p-5">
          <div className="mb-2 flex items-center justify-between"><h3 className="font-semibold">Recent disputes</h3><Link href="/admin/disputes" className="text-xs font-medium text-[#2563EB]">View all</Link></div>
          {disputes.slice(0, 4).map((d) => (
            <p key={d.id} className="border-b border-slate-100 py-2 text-[13px] last:border-0">{d.reference} · {d.status}<br /><span className="text-[#64748B]">{d.reason}</span></p>
          ))}
          {disputes.length === 0 && <p className="text-[13px] text-[#64748B]">No disputes.</p>}
        </Card>
      </div>
    </AdminShell>
  );
}

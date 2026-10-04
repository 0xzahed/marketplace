"use client";
import { useState } from "react";
import { AdminShell } from "@/app/admin/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { bdt } from "@/lib/formatters";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function ReportsPage() {
  const bookings = useApp((s) => s.bookings);
  const services = useApp((s) => s.services);
  const categories = useApp((s) => s.categories);
  const providers = useApp((s) => s.providers);
  const [range, setRange] = useState("6m");

  const gross = bookings.reduce((s, b) => s + b.price.total, 0);
  const revenue = bookings.reduce((s, b) => s + b.price.platformFee, 0);
  const cancelled = bookings.filter((b) => ["Cancelled", "Declined"].includes(b.bookingStatus)).length;
  const cancelRate = bookings.length ? Math.round((cancelled / bookings.length) * 100) : 0;

  const trend = [
    { m: "Apr", gross: 52000, rev: 4700 }, { m: "May", gross: 78000, rev: 7100 },
    { m: "Jun", gross: 64000, rev: 5800 }, { m: "Jul", gross: 95000, rev: 8600 },
    { m: "Aug", gross: 87000, rev: 7900 }, { m: "Sep", gross, rev: revenue },
  ];
  const byCat = categories.slice(0, 6).map((c) => ({
    name: c.name.split(" ")[0], bookings: bookings.filter((b) => services.find((s) => s.id === b.serviceId)?.categoryId === c.id).length,
  }));
  const topProviders = [...providers].sort((a, b) => b.completedJobs - a.completedJobs).slice(0, 5);

  return (
    <AdminShell title="Reports & Analytics" breadcrumb={["Admin", "Reports"]}>
      <div className="mb-3 flex items-center gap-2">
        <Select value={range} onChange={(e) => setRange(e.target.value)} className="w-40">
          <option value="30d">Last 30 days</option><option value="6m">Last 6 months</option><option value="1y">Last year</option>
        </Select>
        <span className="text-xs text-[#64748B]">Range: {range} (demo aggregation)</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[["Gross booking value", bdt(gross)], ["Platform revenue", bdt(revenue)], ["Cancellation rate", `${cancelRate}%`], ["Avg. order value", bdt(bookings.length ? gross / bookings.length : 0)]].map(([l, v]) => (
          <Card key={l} className="p-4"><p className="text-xs text-[#64748B]">{l}</p><p className="mt-0.5 text-xl font-extrabold">{v}</p></Card>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold">Gross vs platform revenue</h3>
          <div className="mt-2 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey="m" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => bdt(Number(v))} />
                <Line type="monotone" dataKey="gross" stroke="#94A3B8" name="Gross" />
                <Line type="monotone" dataKey="rev" stroke="#2563EB" strokeWidth={2} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold">Bookings by category</h3>
          <div className="mt-2 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCat} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12 }} /><YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip /><Bar dataKey="bookings" fill="#2563EB" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card className="mt-4 p-5">
        <h3 className="font-semibold">Provider performance (completed jobs)</h3>
        <div className="mt-3 space-y-2">
          {topProviders.map((p) => (
            <div key={p.id} className="flex items-center gap-3 text-sm">
              <span className="w-40 truncate font-medium">{p.name}</span>
              <div className="h-2.5 flex-1 rounded-full bg-slate-100"><div className="h-2.5 rounded-full bg-[#2563EB]" style={{ width: `${(p.completedJobs / 500) * 100}%` }} /></div>
              <span className="w-12 text-right font-semibold">{p.completedJobs}</span>
            </div>
          ))}
        </div>
      </Card>
    </AdminShell>
  );
}

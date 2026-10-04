"use client";
import Link from "next/link";
import { CustomerShell } from "@/app/customer/shell";
import { useApp } from "@/store/app-store";
import { useAuth } from "@/features/auth/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { timeAgo } from "@/lib/formatters";

const TYPES = ["all", "booking_request", "booking_confirmed", "booking_cancelled", "message", "payment", "review", "verification"] as const;

import { useState } from "react";

export default function NotificationsPage() {
  const { user } = useAuth();
  const notifs = useApp((s) => s.notifications);
  const markRead = useApp((s) => s.markNotifRead);
  const markAll = useApp((s) => s.markAllNotifRead);
  const [filter, setFilter] = useState<(typeof TYPES)[number]>("all");
  const mine = user ? notifs.filter((n) => n.userId === user.id && (filter === "all" || n.type === filter)) : [];
  return (
    <CustomerShell title="Notifications" breadcrumb={["Customer", "Notifications"]}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((t) => (
            <button key={t} onClick={() => setFilter(t)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${filter === t ? "bg-[#0F172A] text-white" : "border border-[#E2E8F0] bg-white"}`}>{t}</button>
          ))}
        </div>
        <Button size="sm" variant="outline" className="ml-auto" onClick={() => user && markAll(user.id)}>Mark all as read</Button>
      </div>
      {mine.length === 0 ? <EmptyState title="No notifications" /> : (
        <div className="space-y-2">
          {mine.map((n) => (
            <Link key={n.id} href={n.link} onClick={() => markRead(n.id)}>
              <Card className={`p-4 ${n.read ? "" : "border-l-4 border-l-[#2563EB]"}`}>
                <p className="text-sm font-semibold">{n.title} <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-[#64748B]">{n.type}</span></p>
                <p className="mt-0.5 text-[13px] text-[#64748B]">{n.body} · {timeAgo(n.at)}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </CustomerShell>
  );
}

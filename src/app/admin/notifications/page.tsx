"use client";
import Link from "next/link";
import { AdminShell } from "@/app/admin/shell";
import { useApp } from "@/store/app-store";
import { useAuth } from "@/features/auth/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { timeAgo } from "@/lib/formatters";

export default function AdminNotifications() {
  const { user } = useAuth();
  const notifs = useApp((s) => s.notifications);
  const markAll = useApp((s) => s.markAllNotifRead);
  const mark = useApp((s) => s.markNotifRead);
  const mine = user ? notifs.filter((n) => n.userId === user.id) : [];
  return (
    <AdminShell title="Notifications" breadcrumb={["Admin", "Notifications"]}>
      <div className="mb-3 flex justify-end">
        <Button size="sm" variant="outline" onClick={() => user && markAll(user.id)}>Mark all as read</Button>
      </div>
      {mine.length === 0 ? <EmptyState title="No notifications" /> : (
        <div className="space-y-2">
          {mine.map((n) => (
            <Link key={n.id} href={n.link} onClick={() => mark(n.id)}>
              <Card className={`p-4 ${n.read ? "" : "border-l-4 border-l-[#2563EB]"}`}>
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="text-[13px] text-[#64748B]">{n.body} · {timeAgo(n.at)}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

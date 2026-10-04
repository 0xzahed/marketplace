"use client";
import { useState } from "react";
import { AdminShell } from "@/app/admin/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/rating";
import { useToast } from "@/components/ui/toaster";
import { useConfirm } from "@/components/ui/confirm";
import { fmtDate } from "@/lib/formatters";

export default function UsersPage() {
  const users = useApp((s) => s.users);
  const bookings = useApp((s) => s.bookings);
  const updateStatus = useApp((s) => s.updateUserStatus);
  const { toast } = useToast();
  const { ask, dialog } = useConfirm();
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");

  const list = users.filter((u) =>
    (!q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())) &&
    (!role || u.role === role)
  );

  return (
    <AdminShell title="Users" breadcrumb={["Admin", "Users"]}>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Search name or email…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="h-10 rounded-[10px] border border-[#E2E8F0] px-3 text-sm">
          <option value="">All roles</option><option value="customer">Customers</option><option value="provider">Providers</option><option value="admin">Admins</option>
        </select>
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead><tr className="bg-slate-50 text-xs text-[#64748B]">
            <th className="px-4 py-2.5">User</th><th className="px-4 py-2.5">Role</th><th className="px-4 py-2.5">Location</th><th className="px-4 py-2.5">Bookings</th><th className="px-4 py-2.5">Status</th><th className="px-4 py-2.5">Actions</th>
          </tr></thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id} className="border-t border-[#E2E8F0]">
                <td className="px-4 py-2.5"><div className="flex items-center gap-2"><Avatar src={u.avatar} name={u.name} size={32} /><span><strong className="block">{u.name}</strong><span className="text-xs text-[#64748B]">{u.email} · {fmtDate(u.createdAt)}</span></span></div></td>
                <td className="px-4 py-2.5 capitalize">{u.role}</td>
                <td className="px-4 py-2.5 text-[13px]">{u.city}, {u.area}</td>
                <td className="px-4 py-2.5">{bookings.filter((b) => b.customerId === u.id).length}</td>
                <td className="px-4 py-2.5"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{u.status}</span></td>
                <td className="px-4 py-2.5">
                  <Button size="sm" variant="outline" onClick={() => ask({
                    title: `${u.status === "Active" ? "Suspend" : "Reactivate"} ${u.name}?`,
                    desc: "Sensitive action — confirmation required (demo).", danger: u.status === "Active",
                    confirmLabel: u.status === "Active" ? "Suspend" : "Reactivate",
                    onConfirm: () => { updateStatus(u.id, u.status === "Active" ? "Suspended" : "Active"); toast({ title: "User updated", kind: "success" }); },
                  })}>{u.status === "Active" ? "Suspend" : "Reactivate"}</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {dialog}
    </AdminShell>
  );
}

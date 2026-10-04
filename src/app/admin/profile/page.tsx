"use client";
import { AdminShell } from "@/app/admin/shell";
import { useAuth } from "@/features/auth/auth-context";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/rating";

export default function AdminProfile() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <AdminShell title="Admin Profile" breadcrumb={["Admin", "Profile"]}>
      <Card className="flex max-w-xl items-center gap-4 p-6">
        <Avatar src={user.avatar} name={user.name} size={72} />
        <div>
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-[#64748B]">{user.email} · {user.phone}</p>
          <p className="mt-1 rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-semibold capitalize text-[#2563EB]">{user.role} · {user.status}</p>
        </div>
      </Card>
    </AdminShell>
  );
}

"use client";
import { ProviderShell, useMyProvider } from "@/app/provider/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/rating";
import { EmptyState } from "@/components/ui/states";
import { bdt } from "@/lib/formatters";

export default function CustomersPage() {
  const me = useMyProvider();
  const bookings = useApp((s) => s.bookings);
  const users = useApp((s) => s.users);
  const mine = bookings.filter((b) => b.providerId === me?.id);
  const ids = [...new Set(mine.map((b) => b.customerId))];
  return (
    <ProviderShell title="Customers" breadcrumb={["Provider", "Customers"]}>
      {ids.length === 0 ? <EmptyState title="No customers yet" /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {ids.map((id) => {
            const u = users.find((x) => x.id === id);
            const jobs = mine.filter((b) => b.customerId === id);
            const spent = jobs.reduce((s, b) => s + b.price.total, 0);
            return (
              <Card key={id} className="flex items-center gap-3 p-4">
                <Avatar src={u?.avatar} name={u?.name ?? "?"} size={48} />
                <div className="flex-1">
                  <p className="font-semibold">{u?.name}</p>
                  <p className="text-[13px] text-[#64748B]">{u?.phone} · {jobs.length} bookings · {bdt(spent)}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </ProviderShell>
  );
}

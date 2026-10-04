"use client";
import Link from "next/link";
import { AdminShell } from "@/app/admin/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, RatingDisplay } from "@/components/ui/rating";
import { VerifiedBadge } from "@/components/ui/badge";

export default function AdminProviders() {
  const providers = useApp((s) => s.providers);
  return (
    <AdminShell title="Providers" breadcrumb={["Admin", "Providers"]}>
      <div className="grid gap-3">
        {providers.map((p) => (
          <Card key={p.id} className="flex flex-wrap items-center gap-3 p-4">
            <Avatar src={p.avatar} name={p.name} size={44} />
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-1.5 font-semibold">{p.name} {p.verified && <VerifiedBadge />}</p>
              <p className="text-[13px] text-[#64748B]">{p.profession} · {p.verificationStatus} · <RatingDisplay value={p.rating} count={p.reviewCount} /></p>
            </div>
            <Link href={`/providers/${p.id}`}><Button size="sm" variant="outline">View Profile</Button></Link>
            <Link href="/admin/providers/verification"><Button size="sm">Verify</Button></Link>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}

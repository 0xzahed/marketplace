"use client";
import { useState } from "react";
import Link from "next/link";
import { CustomerShell } from "@/app/customer/shell";
import { useApp } from "@/store/app-store";
import { ServiceCard } from "@/components/marketplace/cards";
import { EmptyState } from "@/components/ui/states";
import { Button } from "@/components/ui/button";

export default function SavedPage() {
  const saved = useApp((s) => s.savedServiceIds);
  const services = useApp((s) => s.services);
  const providers = useApp((s) => s.providers);
  const list = services.filter((s) => saved.includes(s.id));
  return (
    <CustomerShell title="Saved Services" breadcrumb={["Customer", "Saved"]}>
      {list.length === 0 ? (
        <EmptyState title="No saved services" desc="Tap the heart on any service to save it here." action={<Link href="/services"><Button>Discover Services</Button></Link>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => {
            const p = providers.find((x) => x.id === s.providerId);
            return <ServiceCard key={s.id} service={s} providerName={p?.name} providerAvatar={p?.avatar} verified={s.verified} />;
          })}
        </div>
      )}
    </CustomerShell>
  );
}

"use client";
import { use } from "react";
import { ProviderShell } from "@/app/provider/shell";
import { ServiceForm } from "@/app/provider/services/new/page";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { useApp } from "@/store/app-store";

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const services = useApp((s) => s.services);
  const exists = services.some((s) => s.id === id);
  return (
    <ProviderShell title="Edit Service" breadcrumb={["Provider", "Services", "Edit"]}>
      <Card className="p-5 sm:p-6">
        {exists ? <ServiceForm editId={id} /> : <EmptyState title="Service not found" />}
      </Card>
    </ProviderShell>
  );
}

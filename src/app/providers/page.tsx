"use client";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProviderCard } from "@/components/marketplace/cards";
import { useApp } from "@/store/app-store";

export default function ProvidersPage() {
  const providers = useApp((s) => s.providers);
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold">Professionals</h1>
        <p className="mt-1 text-sm text-[#64748B]">Verified badges reflect actual demo verification state.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {providers.map((p) => <ProviderCard key={p.id} provider={p} />)}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

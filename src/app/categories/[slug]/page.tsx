"use client";
import { use } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ServiceCard } from "@/components/marketplace/cards";
import { useApp } from "@/store/app-store";
import { EmptyState } from "@/components/ui/states";

export default function CategoryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const categories = useApp((s) => s.categories);
  const services = useApp((s) => s.services);
  const providers = useApp((s) => s.providers);
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) {
    return (
      <div className="min-h-screen"><SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-16"><EmptyState title="Category not found" action={<Link href="/categories" className="text-sm font-medium text-[#2563EB]">Back to categories</Link>} /></main>
        <SiteFooter /></div>
    );
  }
  const list = services.filter((s) => s.categoryId === cat.id && s.status === "Published");
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="text-xs text-[#64748B]"><Link href="/categories" className="hover:text-[#2563EB]">Categories</Link> / {cat.name}</p>
        <h1 className="mt-1 text-2xl font-bold">{cat.name}</h1>
        <p className="mt-1 text-sm text-[#64748B]">{cat.description} · {cat.subcategories.join(" · ")}</p>
        {list.length === 0 ? (
          <div className="mt-6"><EmptyState title={`No published services in ${cat.name} yet`} desc="Check back soon or browse all services." /></div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => {
              const p = providers.find((x) => x.id === s.providerId);
              return <ServiceCard key={s.id} service={s} providerName={p?.name} providerAvatar={p?.avatar} verified={s.verified} />;
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

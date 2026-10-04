"use client";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { useApp } from "@/store/app-store";
import { iconFor } from "@/components/marketplace/icons";

export default function CategoriesPage() {
  const categories = useApp((s) => s.categories);
  const services = useApp((s) => s.services);
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold">All Categories</h1>
        <p className="mt-1 text-sm text-[#64748B]">Twelve sample categories. Counts reflect live demo services.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => {
            const Icon = iconFor(c.icon);
            const count = services.filter((s) => s.categoryId === c.id).length;
            return (
              <Link key={c.id} href={`/categories/${c.slug}`} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 transition-shadow hover:shadow-md">
                <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#EFF6FF] text-[#2563EB]"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-3 font-semibold">{c.name}</h3>
                <p className="mt-1 text-sm text-[#64748B]">{c.description}</p>
                <p className="mt-2 text-xs font-medium text-[#2563EB]">{count} services →</p>
              </Link>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

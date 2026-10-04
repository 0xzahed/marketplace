import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ServiceBrowse } from "@/components/marketplace/service-browse";

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold">Explore Services</h1>
        <p className="mt-1 text-sm text-[#64748B]">Filter by category, price, rating and availability. All sample data.</p>
        <div className="mt-6">
          <Suspense fallback={<p className="text-sm text-[#64748B]">Loading services…</p>}>
            <ServiceBrowse />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

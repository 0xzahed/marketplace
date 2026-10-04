import Link from "next/link";
import { Search, UserPlus, CalendarCheck, ArrowRight, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold sm:text-3xl">How Fixora Works</h1>
        <p className="mt-2 text-sm text-[#64748B]">For customers, providers and everyone in between. This is a frontend prototype — payments and notifications are simulated.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { icon: Search, t: "Find a Service", d: "Search by keyword and area, filter by price, rating and verified status." },
            { icon: UserPlus, t: "Choose a Professional", d: "Compare profiles, portfolios, completed jobs and demo reviews." },
            { icon: CalendarCheck, t: "Book and Get It Done", d: "Select package, slot and address. Confirm with bKash/Nagad/Rocket/Card (simulated) or Cash." },
          ].map((s) => (
            <Card key={s.t} className="p-6"><s.icon className="h-8 w-8 text-[#2563EB]" /><h3 className="mt-3 font-semibold">{s.t}</h3><p className="mt-1 text-sm text-[#64748B]">{s.d}</p></Card>
          ))}
        </div>
        <Card className="mt-6 p-6">
          <h2 className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-5 w-5 text-emerald-500" /> Trust & Safety (demo)</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#334155]">
            <li>Verification queue: admins approve NID + documents; badges update everywhere instantly.</li>
            <li>One review per completed booking; reported reviews go to moderation.</li>
            <li>Disputes: Open → Under Review → Resolved with admin notes.</li>
            <li>Platform fee: 10% service fee shown separately at checkout (charged to customer in this demo).</li>
          </ul>
        </Card>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/services"><Button>Browse Services <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link href="/become-a-provider"><Button variant="outline">Become a Provider</Button></Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

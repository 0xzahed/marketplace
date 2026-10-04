"use client";
import Link from "next/link";
import {
  ShieldCheck, Tag, CalendarCheck, Star, Search,
  CheckCircle2, ArrowRight, UserPlus,
} from "lucide-react";
import { iconFor } from "@/components/marketplace/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SearchBar } from "@/components/marketplace/search-bar";
import { ServiceCard, ProviderCard } from "@/components/marketplace/cards";
import { useApp } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, RatingDisplay, SmartImage } from "@/components/ui/rating";
import { useState } from "react";

const TRUST = [
  { icon: ShieldCheck, title: "Verified professionals", desc: "NID-checked demo profiles" },
  { icon: Tag, title: "Transparent pricing", desc: "Upfront BDT quotes" },
  { icon: CalendarCheck, title: "Secure booking", desc: "Simulated escrow flow" },
  { icon: Star, title: "Customer reviews", desc: "Rated after each job" },
];

const TESTIMONIALS = [
  { name: "Nusrat J.", avatar: "https://i.pravatar.cc/150?img=47", text: "Demo testimonial: booked AC servicing in minutes. Technician arrived on time with proper tools.", service: "AC Repair & Servicing", rating: 5 },
  { name: "Tanvir R.", avatar: "https://i.pravatar.cc/150?img=33", text: "Demo testimonial: deep cleaning crew was thorough — kitchen and washrooms look new.", service: "Home Deep Cleaning", rating: 5 },
  { name: "Mitu S.", avatar: "https://i.pravatar.cc/150?img=32", text: "Demo testimonial: photographer delivered previews in 3 days. Booking & payment flow was simple.", service: "Professional Photography", rating: 4 },
];

const FAQS = [
  { q: "How does booking work?", a: "Search a service, pick a package and time slot, add your address, then confirm. This prototype simulates payment — no real money moves." },
  { q: "How are providers verified?", a: "Demo providers submit NID, photo and trade proof. Admins approve them in the verification queue; only approved providers show a Verified badge." },
  { q: "When is payment collected?", a: "Online methods (bKash, Nagad, Rocket, Card) are simulated at booking; Cash on Service is paid after the job. All demo transactions are labelled." },
  { q: "How does cancellation work?", a: "Each listing shows its policy (typically free up to 12–24 hrs before). Cancel from My Bookings with a reason." },
  { q: "How do I become a provider?", a: "Use Become a Provider: create an account, add professional details, service areas, documents and your first service. You start as Pending Verification." },
  { q: "How do refunds work?", a: "Refunds are simulated by admins from Payments. A paid booking that is cancelled moves to Refund Pending, then Refunded — demo only." },
];

export default function HomePage() {
  const services = useApp((s) => s.services);
  const providers = useApp((s) => s.providers);
  const categories = useApp((s) => s.categories);
  const [faq, setFaq] = useState<number | null>(0);

  const featured = services.filter((s) => s.status === "Published").slice(0, 6);
  const featuredProviders = providers.slice(0, 4);
  const provOf = (pid: string) => providers.find((p) => p.id === pid);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0F172A]">
        <div className="absolute inset-0 opacity-20">
          <img src="https://picsum.photos/seed/fixora-hero/1600/700" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/85 to-[#0F172A]/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-200">
              <ShieldCheck className="h-3.5 w-3.5" /> Trusted pros across Dhaka · Demo prototype
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
              Find Trusted Professionals for Every Job
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300">
              From home repairs to everyday tasks, discover skilled professionals and book reliable services with confidence.
            </p>
            <div className="mt-6"><SearchBar large /></div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {["Verified professionals", "Transparent pricing", "Secure booking", "Customer reviews"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 text-[13px] text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">Popular Categories</h2>
            <p className="mt-1 text-sm text-[#64748B]">Browse sample categories with live counts from demo data.</p>
          </div>
          <Link href="/categories" className="hidden items-center gap-1 text-sm font-medium text-[#2563EB] sm:inline-flex">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 12).map((c) => {
            const Icon = iconFor(c.icon);
            const count = services.filter((s) => s.categoryId === c.id).length || c.serviceCount;
            return (
              <Link key={c.id} href={`/categories/${c.slug}`} className="group rounded-[16px] border border-[#E2E8F0] bg-white p-4 transition-shadow hover:shadow-md">
                <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#EFF6FF] text-[#2563EB]"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-3 text-sm font-semibold group-hover:text-[#2563EB]">{c.name}</h3>
                <p className="text-xs text-[#64748B]">{count} services</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="border-y border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">Popular Services Near You</h2>
              <p className="mt-1 text-sm text-[#64748B]">Sample prices in BDT · ratings are demo data.</p>
            </div>
            <Link href="/services" className="hidden items-center gap-1 text-sm font-medium text-[#2563EB] sm:inline-flex">View all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => {
              const p = provOf(s.providerId);
              return <ServiceCard key={s.id} service={s} providerName={p?.name} providerAvatar={p?.avatar} verified={s.verified} />;
            })}
          </div>
        </div>
      </section>

      {/* PROFESSIONALS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">Featured Professionals</h2>
            <p className="mt-1 text-sm text-[#64748B]">Verified badges reflect actual demo verification state.</p>
          </div>
          <Link href="/providers" className="hidden items-center gap-1 text-sm font-medium text-[#2563EB] sm:inline-flex">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProviders.map((p) => <ProviderCard key={p.id} provider={p} />)}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-[#E2E8F0] bg-[#EFF6FF]/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="text-center text-xl font-bold sm:text-2xl">How It Works</h2>
          <p className="mx-auto mt-1 max-w-md text-center text-sm text-[#64748B]">Three simple steps to get any job done.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: Search, t: "1. Find a Service", d: "Search by keyword, area and category. Compare ratings, prices and verified badges." },
              { icon: UserPlus, t: "2. Choose a Professional", d: "Open profiles, check portfolios, reviews and availability before you decide." },
              { icon: CalendarCheck, t: "3. Book and Get It Done", d: "Pick a slot, confirm the address and pay online (simulated) or cash after service." },
            ].map((s) => (
              <Card key={s.t} className="p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2563EB] text-white"><s.icon className="h-5 w-5" /></span>
                <h3 className="mt-4 font-semibold">{s.t}</h3>
                <p className="mt-1.5 text-sm text-[#64748B]">{s.d}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center"><Link href="/how-it-works"><Button size="lg">Learn More</Button></Link></div>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="text-xl font-bold sm:text-2xl">Why Choose Fixora</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Verified professionals", "NID & document checks in the demo admin queue."],
            ["Clear pricing", "Starting prices in BDT, packages, add-ons and a disclosed 10% service fee."],
            ["Convenient scheduling", "Date + slot picker with mock availability and blocked past dates."],
            ["Customer reviews", "One review per completed booking; providers can reply."],
            ["Booking management", "Track Pending → Confirmed → In Progress → Completed in one place."],
            ["Support & disputes", "Raise disputes; admins mediate with a resolution workflow."],
          ].map(([t, d]) => (
            <div key={t} className="flex gap-3 rounded-[16px] border border-[#E2E8F0] bg-white p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <div><h3 className="text-sm font-semibold">{t}</h3><p className="mt-1 text-sm text-[#64748B]">{d}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="text-xl font-bold sm:text-2xl">What Customers Say</h2>
          <p className="mt-1 text-sm text-[#64748B]">Demo testimonials for illustration — not genuine verified feedback.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="p-5">
                <RatingDisplay value={t.rating} />
                <p className="mt-2 text-sm leading-relaxed text-[#334155]">“{t.text}”</p>
                <div className="mt-4 flex items-center gap-2.5">
                  <Avatar src={t.avatar} name={t.name} size={36} />
                  <div><p className="text-sm font-semibold">{t.name}</p><p className="text-xs text-[#64748B]">{t.service}</p></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="overflow-hidden rounded-[20px] bg-[#0F172A]">
          <div className="grid md:grid-cols-2">
            <div className="p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Grow Your Service Business with Fixora</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {["Free professional profile & portfolio", "Booking & calendar management", "Simulated payouts & earnings tracking", "Reviews that build trust"].map((b) => (
                  <li key={b} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />{b}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="/become-a-provider"><Button size="lg">Become a Provider</Button></Link>
                <Link href="/how-it-works"><Button size="lg" variant="outline" className="border-slate-600 bg-transparent text-white hover:bg-white/10">How registration works</Button></Link>
              </div>
            </div>
            <div className="relative min-h-[220px]">
              <SmartImage src="https://picsum.photos/seed/fixora-cta/900/600" alt="Service professional at work" seed="fixora-cta" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-14 sm:px-6">
        <h2 className="text-center text-xl font-bold sm:text-2xl">Frequently Asked Questions</h2>
        <div className="mt-6 space-y-2">
          {FAQS.map((f, i) => (
            <div key={i} className="rounded-[12px] border border-[#E2E8F0] bg-white">
              <button onClick={() => setFaq(faq === i ? null : i)} className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-medium" aria-expanded={faq === i}>
                {f.q}<span className="text-[#2563EB]">{faq === i ? "−" : "+"}</span>
              </button>
              {faq === i && <p className="px-4 pb-4 text-sm leading-relaxed text-[#64748B]">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

"use client";
import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, MessageCircle, CalendarCheck, Heart, Share2, CheckCircle2, XCircle } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { useApp } from "@/store/app-store";
import { useAuth } from "@/features/auth/auth-context";
import { ServiceCard } from "@/components/marketplace/cards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VerifiedBadge } from "@/components/ui/badge";
import { Avatar, RatingDisplay, SmartImage } from "@/components/ui/rating";
import { EmptyState } from "@/components/ui/states";
import { bdt } from "@/lib/formatters";
import { useToast } from "@/components/ui/toaster";

export default function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const services = useApp((s) => s.services);
  const providers = useApp((s) => s.providers);
  const categories = useApp((s) => s.categories);
  const reviews = useApp((s) => s.reviews);
  const saved = useApp((s) => s.savedServiceIds);
  const toggleSave = useApp((s) => s.toggleSaveService);
  const getOrCreate = useApp((s) => s.getOrCreateConversation);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [img, setImg] = useState(0);

  const svc = services.find((s) => s.slug === slug);
  if (!svc) {
    return <div className="min-h-screen"><SiteHeader /><main className="mx-auto max-w-3xl px-4 py-16"><EmptyState title="Service not found" /></main><SiteFooter /></div>;
  }
  const prov = providers.find((p) => p.id === svc.providerId);
  const cat = categories.find((c) => c.id === svc.categoryId);
  const svcReviews = reviews.filter((r) => r.serviceId === svc.id && r.status !== "hidden");
  const related = services.filter((s) => s.categoryId === svc.categoryId && s.id !== svc.id && s.status === "Published").slice(0, 3);
  const isSaved = saved.includes(svc.id);
  const unavailable = svc.status !== "Published";

  const message = () => {
    if (!user) { router.push("/login"); return; }
    if (!prov) return;
    getOrCreate(user.id, prov.id);
    router.push(user.role === "provider" ? "/provider/messages" : "/customer/messages");
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <p className="text-xs text-[#64748B]">
          <Link href="/services" className="hover:text-[#2563EB]">Services</Link> / {cat?.name} / <span className="text-[#0F172A]">{svc.title}</span>
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            <SmartImage src={svc.images[img] ?? svc.images[0]} alt={svc.title} seed={svc.id} className="h-64 w-full rounded-[16px] object-cover sm:h-96" />
            {svc.images.length > 1 && (
              <div className="mt-2 flex gap-2">
                {svc.images.map((im, i) => (
                  <button key={i} onClick={() => setImg(i)} className={`overflow-hidden rounded-[10px] border-2 ${i === img ? "border-[#2563EB]" : "border-transparent"}`}>
                    <img src={im} alt="" className="h-16 w-24 object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {svc.verified && <VerifiedBadge />}
              <span className="inline-flex items-center gap-1 text-[13px] text-[#64748B]"><MapPin className="h-3.5 w-3.5" />{svc.location}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs">{svc.mode === "onsite" ? "On-site" : svc.mode === "remote" ? "Remote" : "On-site / Remote"}</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{svc.title}</h1>
            <div className="mt-2 flex items-center gap-3">
              <RatingDisplay value={svc.rating} count={svc.reviewCount} />
              <button onClick={() => toggleSave(svc.id)} className="inline-flex items-center gap-1 text-sm text-[#64748B] hover:text-red-500">
                <Heart className={isSaved ? "h-4 w-4 fill-red-500 text-red-500" : "h-4 w-4"} /> {isSaved ? "Saved" : "Save"}
              </button>
              <button onClick={() => toast({ title: "Link copied", desc: "Service URL copied (demo).", kind: "success" })} className="inline-flex items-center gap-1 text-sm text-[#64748B]"><Share2 className="h-4 w-4" /> Share</button>
            </div>

            <Card className="mt-5 p-5">
              <h2 className="font-semibold">About this service</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#334155]">{svc.description}</p>
              <p className="mt-3 rounded-[10px] bg-[#EFF6FF] p-3 text-[13px] text-[#1D4ED8]">
                Final price may depend on on-site inspection, scope, and materials. Starting price shown; packages and add-ons selected at booking.
              </p>
            </Card>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Card className="p-5">
                <h3 className="text-sm font-semibold">What&apos;s included</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-[#334155]">
                  {svc.included.map((i) => <li key={i} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{i}</li>)}
                </ul>
              </Card>
              <Card className="p-5">
                <h3 className="text-sm font-semibold">Not included</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-[#334155]">
                  {svc.excluded.map((i) => <li key={i} className="flex gap-2"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />{i}</li>)}
                </ul>
              </Card>
            </div>

            <Card className="mt-4 p-5">
              <h3 className="text-sm font-semibold">How it works</h3>
              <ol className="mt-2 space-y-1.5 text-sm text-[#334155]">
                {svc.process.map((p, i) => <li key={i}>{i + 1}. {p}</li>)}
              </ol>
              <h3 className="mt-4 text-sm font-semibold">Requirements</h3>
              <p className="mt-1 text-sm text-[#334155]">{svc.requirements}</p>
              <h3 className="mt-4 text-sm font-semibold">Cancellation policy</h3>
              <p className="mt-1 text-sm text-[#334155]">{svc.cancellationPolicy}</p>
            </Card>

            {prov && (
              <Card className="mt-4 flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
                <Avatar src={prov.avatar} name={prov.name} size={56} />
                <div className="flex-1">
                  <div className="flex items-center gap-2"><Link href={`/providers/${prov.id}`} className="font-semibold hover:text-[#2563EB]">{prov.name}</Link>{prov.verified && <VerifiedBadge />}</div>
                  <p className="text-[13px] text-[#64748B]">{prov.profession} · {prov.completedJobs} jobs · responds {prov.responseTime}</p>
                </div>
                <Link href={`/providers/${prov.id}`}><Button variant="outline">View Profile</Button></Link>
              </Card>
            )}

            <Card className="mt-4 p-5">
              <h3 className="font-semibold">Customer reviews ({svcReviews.length})</h3>
              <div className="mt-3 space-y-3">
                {svcReviews.length === 0 && <p className="text-sm text-[#64748B]">No reviews yet for this demo listing.</p>}
                {svcReviews.map((r) => (
                  <div key={r.id} className="rounded-[12px] border border-[#E2E8F0] p-3.5">
                    <div className="flex items-center gap-2"><Avatar src={r.customerAvatar} name={r.customerName} size={32} />
                      <div><p className="text-sm font-medium">{r.customerName}</p><RatingDisplay value={r.rating} /></div></div>
                    <p className="mt-2 text-sm">{r.text}</p>
                  </div>
                ))}
              </div>
            </Card>

            {related.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 font-semibold">Related services</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((s) => {
                    const p = providers.find((x) => x.id === s.providerId);
                    return <ServiceCard key={s.id} service={s} providerName={p?.name} providerAvatar={p?.avatar} verified={s.verified} />;
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="lg:sticky lg:top-20">
              <Card className="p-5">
                <p className="text-xs text-[#64748B]">{svc.pricingModel === "quote" ? "Custom quote" : "Starting from"}</p>
                <p className="text-2xl font-extrabold">{bdt(svc.startingPrice)}</p>
                <div className="mt-1"><RatingDisplay value={svc.rating} count={svc.reviewCount} /></div>
                {prov && <p className="mt-2 text-[13px] text-[#64748B]">by <Link href={`/providers/${prov.id}`} className="font-medium text-[#2563EB]">{prov.name}</Link></p>}
                <div className="mt-4 space-y-2 border-t border-[#E2E8F0] pt-4">
                  {svc.packages.map((pk) => (
                    <div key={pk.id} className="flex items-center justify-between rounded-[10px] bg-slate-50 px-3 py-2 text-sm">
                      <span>{pk.name}</span><strong>{bdt(pk.price)}</strong>
                    </div>
                  ))}
                </div>
                {unavailable ? (
                  <div className="mt-4 rounded-[10px] bg-amber-50 p-3 text-sm text-amber-800">This listing is currently {svc.status.toLowerCase()} and cannot be booked.</div>
                ) : (
                  <>
                    <Link href={`/book/${svc.slug}`}><Button size="lg" className="mt-4 w-full"><CalendarCheck className="h-4 w-4" /> Book Now</Button></Link>
                    <Button variant="outline" className="mt-2 w-full" onClick={message}><MessageCircle className="h-4 w-4" /> Message Provider</Button>
                  </>
                )}
                <p className="mt-3 text-center text-[11px] text-[#94A3B8]">Simulated booking · no real payment</p>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <div className="mt-10"><SiteFooter /></div>
    </div>
  );
}

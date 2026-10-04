"use client";
import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarCheck, Flag, Heart, MapPin, MessageCircle, Languages, Clock, Briefcase } from "lucide-react";
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
import { Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";

export default function ProviderProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const providers = useApp((s) => s.providers);
  const services = useApp((s) => s.services);
  const reviews = useApp((s) => s.reviews);
  const saved = useApp((s) => s.savedProviderIds.includes(id));
  const toggleSave = useApp((s) => s.toggleSaveProvider);
  const getOrCreate = useApp((s) => s.getOrCreateConversation);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [report, setReport] = useState(false);
  const [reason, setReason] = useState("");

  const p = providers.find((x) => x.id === id);
  if (!p) {
    return <div className="min-h-screen"><SiteHeader /><main className="mx-auto max-w-3xl px-4 py-16"><EmptyState title="Provider not found" /></main><SiteFooter /></div>;
  }
  const offered = services.filter((s) => s.providerId === p.id && s.status === "Published");
  const provReviews = reviews.filter((r) => r.providerId === p.id && r.status === "published");

  const message = () => {
    if (!user) { router.push("/login"); return; }
    const cid = getOrCreate(user.id, p.id);
    toast({ title: "Conversation ready", desc: "Opened chat with " + p.name, kind: "success" });
    router.push(user.role === "provider" ? "/provider/messages" : "/customer/messages");
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="relative h-48 sm:h-64">
        <SmartImage src={p.cover} alt={`${p.name} cover`} seed={p.id} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
          <Avatar src={p.avatar} name={p.name} size={112} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0F172A]">{p.name}</h1>
              {p.verified && <VerifiedBadge />}
            </div>
            <p className="text-sm text-[#64748B]">{p.profession} · {p.headline}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#64748B]">
              <RatingDisplay value={p.rating} count={p.reviewCount} />
              <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{p.completedJobs} jobs · {p.experienceYears} yrs</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{p.location}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => { const s = offered[0]; if (s) router.push(`/book/${s.slug}`); else toast({ title: "No bookable service", kind: "info" }); }}><CalendarCheck className="h-4 w-4" /> Book Service</Button>
            <Button variant="outline" onClick={message}><MessageCircle className="h-4 w-4" /> Send Message</Button>
            <Button variant="outline" onClick={() => toggleSave(p.id)} aria-label="Save provider"><Heart className={saved ? "h-4 w-4 fill-red-500 text-red-500" : "h-4 w-4"} /></Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Card className="p-5">
              <h2 className="font-semibold">About</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#334155]">{p.about}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.skills.map((s) => <span key={s} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs">{s}</span>)}
              </div>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <p className="inline-flex items-center gap-2 text-[#64748B]"><Languages className="h-4 w-4" /> {p.languages.join(", ")}</p>
                <p className="inline-flex items-center gap-2 text-[#64748B]"><Clock className="h-4 w-4" /> {p.workingHours}</p>
                <p className="inline-flex items-center gap-2 text-[#64748B]"><MapPin className="h-4 w-4" /> Serves: {p.serviceAreas.join(", ")}</p>
                <p className="inline-flex items-center gap-2 text-[#64748B]"><MessageCircle className="h-4 w-4" /> Responds {p.responseTime}</p>
              </div>
            </Card>

            <div>
              <h2 className="mb-3 font-semibold">Services offered ({offered.length})</h2>
              {offered.length === 0 ? <EmptyState title="No published services" /> : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {offered.map((s) => <ServiceCard key={s.id} service={s} providerName={p.name} providerAvatar={p.avatar} verified={s.verified} />)}
                </div>
              )}
            </div>

            <Card className="p-5">
              <h2 className="font-semibold">Portfolio</h2>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {p.portfolio.map((img, i) => <SmartImage key={i} src={img} alt={`${p.name} work ${i + 1}`} seed={`${p.id}-${i}`} className="h-32 w-full rounded-[12px] object-cover" />)}
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold">Reviews ({provReviews.length})</h2>
              <div className="mt-3 space-y-3">
                {provReviews.length === 0 && <p className="text-sm text-[#64748B]">No reviews yet.</p>}
                {provReviews.map((r) => (
                  <div key={r.id} className="rounded-[12px] border border-[#E2E8F0] p-3.5">
                    <div className="flex items-center gap-2">
                      <Avatar src={r.customerAvatar} name={r.customerName} size={32} />
                      <div><p className="text-sm font-medium">{r.customerName}</p><RatingDisplay value={r.rating} /></div>
                    </div>
                    <p className="mt-2 text-sm text-[#334155]">{r.text}</p>
                    {r.reply && <p className="mt-2 rounded-lg bg-slate-50 p-2.5 text-[13px]"><strong>Provider reply:</strong> {r.reply.text}</p>}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold">Availability</h3>
              <p className="mt-1 text-sm text-[#64748B]">{p.workingHours}</p>
              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px]">
                {["S", "S", "M", "T", "W", "T", "F"].map((d, i) => (
                  <span key={i} className={`rounded-lg py-2 font-semibold ${i === 5 ? "bg-slate-100 text-slate-400" : "bg-emerald-50 text-emerald-700"}`}>{d}</span>
                ))}
              </div>
              <Button className="mt-4 w-full" onClick={() => { const s = offered[0]; if (s) router.push(`/book/${s.slug}`); }}>Check Slots & Book</Button>
            </Card>
            <Card className="p-5">
              <button onClick={() => setReport((v) => !v)} className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-red-600">
                <Flag className="h-4 w-4" /> Report this profile
              </button>
              {report && (
                <div className="mt-3">
                  <Textarea placeholder="Reason for reporting…" value={reason} onChange={(e) => setReason(e.target.value)} />
                  <Button size="sm" variant="danger" className="mt-2" onClick={() => { toast({ title: "Report submitted", desc: "Admins will review this profile (demo).", kind: "success" }); setReport(false); setReason(""); }}>Submit Report</Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
      <div className="mt-10"><SiteFooter /></div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import type { Provider, Service } from "@/types";
import { useApp } from "@/store/app-store";
import { bdt } from "@/lib/formatters";
import { Badge, VerifiedBadge } from "@/components/ui/badge";
import { Avatar, RatingDisplay, SmartImage } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ServiceCard({ service, providerName, providerAvatar, verified }: {
  service: Service; providerName?: string; providerAvatar?: string; verified?: boolean;
}) {
  const saved = useApp((s) => s.savedServiceIds.includes(service.id));
  const toggle = useApp((s) => s.toggleSaveService);
  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative">
        <Link href={`/services/${service.slug}`}>
          <SmartImage src={service.images[0]} alt={service.title} seed={service.id} className="h-44 w-full object-cover" />
        </Link>
        <button
          onClick={() => toggle(service.id)}
          aria-label={saved ? "Remove from favorites" : "Save to favorites"}
          className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow"
        >
          <Heart className={saved ? "h-4 w-4 fill-red-500 text-red-500" : "h-4 w-4 text-slate-600"} />
        </button>
        {service.status !== "Published" && (
          <span className="absolute left-2.5 top-2.5"><Badge className="bg-amber-100 text-amber-800">{service.status}</Badge></span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          {verified && <VerifiedBadge />}
          <span className="inline-flex items-center gap-1 text-xs text-[#64748B]"><MapPin className="h-3 w-3" />{service.location}</span>
        </div>
        <Link href={`/services/${service.slug}`} className="mt-1.5 font-semibold leading-snug text-[#0F172A] hover:text-[#2563EB]">
          {service.title}
        </Link>
        <div className="mt-1.5 flex items-center gap-2 text-[13px]">
          <Avatar src={providerAvatar} name={providerName ?? "?"} size={20} />
          <span className="truncate text-[#64748B]">{providerName}</span>
        </div>
        <div className="mt-1.5"><RatingDisplay value={service.rating} count={service.reviewCount} /></div>
        <div className="mt-3 flex items-center justify-between border-t border-[#E2E8F0] pt-3">
          <div>
            <p className="text-[11px] text-[#64748B]">{service.pricingModel === "quote" ? "Custom quote" : "Starting from"}</p>
            <p className="text-[15px] font-bold text-[#0F172A]">{bdt(service.startingPrice)}</p>
          </div>
          <Link href={`/services/${service.slug}`}><Button size="sm" variant="outline">View Details</Button></Link>
        </div>
      </div>
    </Card>
  );
}

export function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <Card className="flex flex-col items-center p-5 text-center transition-shadow hover:shadow-md">
      <Avatar src={provider.avatar} name={provider.name} size={72} />
      <div className="mt-3 flex items-center gap-1.5">
        <h3 className="font-semibold text-[#0F172A]">{provider.name}</h3>
        {provider.verified && <VerifiedBadge />}
      </div>
      <p className="text-[13px] text-[#64748B]">{provider.profession}</p>
      <div className="mt-2"><RatingDisplay value={provider.rating} count={provider.reviewCount} /></div>
      <p className="mt-1 text-xs text-[#64748B]">{provider.completedJobs} jobs · {provider.experienceYears} yrs · {provider.location}</p>
      <Link href={`/providers/${provider.id}`} className="mt-4 w-full"><Button variant="outline" className="w-full">View Profile</Button></Link>
    </Card>
  );
}

"use client";
import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Tag } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { useApp } from "@/store/app-store";
import { useAuth } from "@/features/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, FieldError, Textarea, Select } from "@/components/ui/input";
import { VerifiedBadge } from "@/components/ui/badge";
import { Avatar, RatingDisplay } from "@/components/ui/rating";
import { EmptyState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toaster";
import { bdt, fmtDate } from "@/lib/formatters";
import { calcTotals, couponDiscount } from "@/lib/pricing";
import { bdCities, dhakaAreas, paymentMethods, timeSlots } from "@/data/seed";

const STEPS = ["Service", "Schedule", "Address", "Summary", "Payment"];

function nextDays(n: number): string[] {
  const out: string[] = [];
  const d = new Date();
  for (let i = 1; i <= n; i++) {
    const t = new Date(d);
    t.setDate(d.getDate() + i);
    out.push(t.toISOString().slice(0, 10));
  }
  return out;
}

export default function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const services = useApp((s) => s.services);
  const providers = useApp((s) => s.providers);
  const coupons = useApp((s) => s.coupons);
  const settings = useApp((s) => s.settings);
  const addBooking = useApp((s) => s.addBooking);
  const markCouponUsed = useApp((s) => s.useCoupon);
  const notify = useApp((s) => s.notify);
  const bookings = useApp((s) => s.bookings);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const svc = services.find((s) => s.slug === slug);
  const prov = providers.find((p) => p.id === svc?.providerId);

  const [step, setStep] = useState(0);
  const [pkgId, setPkgId] = useState<string>("");
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [mode, setMode] = useState<"onsite" | "remote">("onsite");
  const [addr, setAddr] = useState({ name: user?.name ?? "", phone: user?.phone ?? "", city: "Dhaka", area: "Dhanmondi", street: "", notes: "" });
  const [coupon, setCoupon] = useState("");
  const [couponErr, setCouponErr] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [method, setMethod] = useState("bKash");
  const [submitting, setSubmitting] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);

  const days = nextDays(14);
  const pkg = svc?.packages.find((p) => p.id === (pkgId || svc.packages[0]?.id)) ?? svc?.packages[0];
  const basePrice = pkg?.price ?? svc?.startingPrice ?? 0;
  const addonsTotal = (svc?.addons ?? []).filter((a) => addonIds.includes(a.id)).reduce((s, a) => s + a.price, 0);

  const applied = appliedCoupon ? coupons.find((x) => x.code === appliedCoupon) : undefined;
  const discount = applied ? couponDiscount(applied, basePrice + addonsTotal) : 0;

  const totals = calcTotals({ basePrice, addonsTotal, discount, feePercent: settings.platformFeePercent, couponCode: appliedCoupon ?? undefined });

  if (!svc || !prov) {
    return <div className="min-h-screen"><SiteHeader /><main className="mx-auto max-w-3xl px-4 py-16"><EmptyState title="Service not found" /></main><SiteFooter /></div>;
  }
  if (svc.status !== "Published") {
    return <div className="min-h-screen"><SiteHeader /><main className="mx-auto max-w-3xl px-4 py-16"><EmptyState title="Service not available" desc={`This listing is ${svc.status.toLowerCase()} and cannot be booked right now.`} action={<Link href="/services"><Button>Browse services</Button></Link>} /></main><SiteFooter /></div>;
  }
  if (doneId) {
    const b = bookings.find((x) => x.id === doneId);
    return (
      <div className="min-h-screen"><SiteHeader />
        <main className="mx-auto max-w-2xl px-4 py-12 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
          <h1 className="mt-4 text-2xl font-bold">Booking Confirmed! (Demo)</h1>
          <p className="mt-1 text-sm text-[#64748B]">Reference <strong className="text-[#0F172A]">{b?.reference}</strong> · simulated — no real payment processed.</p>
          <Card className="mt-6 p-5 text-left text-sm">
            <p><strong>Service:</strong> {svc.title} {pkg ? `· ${pkg.name}` : ""}</p>
            <p><strong>Provider:</strong> {prov.name}</p>
            <p><strong>Schedule:</strong> {b ? fmtDate(b.date) : date} at {b?.timeSlot ?? slot}</p>
            <p><strong>Address:</strong> {b?.address.street}, {b?.address.area}, {b?.address.city}</p>
            <p><strong>Total:</strong> {bdt(b?.price.total ?? totals.total)} via {b?.paymentMethod} · <span className="text-[#64748B]">{b?.paymentStatus}</span></p>
            <p><strong>Status:</strong> {b?.bookingStatus}</p>
          </Card>
          <div className="mt-6 flex justify-center gap-2">
            {b && <Link href={`/customer/bookings/${b.id}`}><Button>View Booking</Button></Link>}
            <Link href="/"><Button variant="outline">Back to Home</Button></Link>
          </div>
        </main><SiteFooter /></div>
    );
  }

  const canNext = (): string | null => {
    if (step === 0 && !pkg) return "Select a package.";
    if (step === 1 && (!date || !slot)) return "Pick a date and time slot.";
    if (step === 2) {
      if (!addr.name.trim()) return "Enter your name.";
      if (addr.phone.replace(/\D/g, "").length < 11) return "Enter a valid BD phone number.";
      if (mode === "onsite" && !addr.street.trim()) return "Enter street/house address for on-site service.";
    }
    return null;
  };

  const applyCoupon = () => {
    setCouponErr("");
    const c = coupons.find((x) => x.code.toUpperCase() === coupon.trim().toUpperCase());
    if (!c) { setCouponErr("Invalid coupon code."); return; }
    if (!c.active) { setCouponErr("This coupon is inactive."); return; }
    const sub = basePrice + addonsTotal;
    if (sub < c.minAmount) { setCouponErr(`Requires minimum order of ${bdt(c.minAmount)}.`); return; }
    const d = couponDiscount(c, sub);
    if (d <= 0) { setCouponErr("Coupon not eligible (expired or usage limit reached)."); return; }
    setAppliedCoupon(c.code);
    toast({ title: `Coupon ${c.code} applied`, desc: `You save ${bdt(d)}.`, kind: "success" });
  };

  const confirm = () => {
    if (!user) { router.push("/login"); return; }
    if (submitting) return;
    setSubmitting(true);
    // conflict check: provider cannot have two non-cancelled bookings same slot
    const clash = bookings.some((b) => b.providerId === prov.id && b.date === date && b.timeSlot === slot && !["Cancelled", "Declined"].includes(b.bookingStatus));
    if (clash) {
      toast({ title: "Slot just taken", desc: "That slot is no longer available (demo conflict). Pick another.", kind: "error" });
      setSubmitting(false);
      setStep(1);
      return;
    }
    const b = addBooking({
      serviceId: svc.id, providerId: prov.id, customerId: user.id,
      packageId: pkg?.id, packageName: pkg?.name, addonIds,
      date, timeSlot: slot, address: { ...addr }, mode: svc.mode === "remote" ? "remote" : svc.mode === "onsite" ? "onsite" : mode,
      price: totals, paymentMethod: method,
      bookingStatus: "Pending", paymentStatus: method === "Cash on Service" ? "Unpaid" : "Pending",
    });
    if (appliedCoupon) markCouponUsed(appliedCoupon);
    notify({ userId: user.id, type: "booking_request", title: "Booking request sent", body: `${svc.title} · ${b.reference}`, link: `/customer/bookings/${b.id}` });
    setDoneId(b.id);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link href={`/services/${svc.slug}`} className="inline-flex items-center gap-1 text-sm text-[#64748B] hover:text-[#2563EB]"><ArrowLeft className="h-4 w-4" /> Back to service</Link>
        <h1 className="mt-2 text-2xl font-bold">Book: {svc.title}</h1>
        <div className="mt-4 flex gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full ${i <= step ? "bg-[#2563EB]" : "bg-slate-200"}`} />
              <p className={`mt-1 hidden text-[11px] sm:block ${i <= step ? "font-semibold text-[#2563EB]" : "text-[#94A3B8]"}`}>{i + 1}. {s}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            {step === 0 && (
              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar src={prov.avatar} name={prov.name} size={44} />
                  <div><p className="font-medium">{prov.name} {prov.verified && <VerifiedBadge />}</p><RatingDisplay value={prov.rating} count={prov.reviewCount} /></div>
                </div>
                <h3 className="mt-4 text-sm font-semibold">Select a package</h3>
                <div className="mt-2 space-y-2">
                  {svc.packages.map((p) => (
                    <label key={p.id} className={`flex cursor-pointer items-center justify-between rounded-[12px] border p-3.5 ${pkg?.id === p.id ? "border-[#2563EB] bg-[#EFF6FF]" : "border-[#E2E8F0]"}`}>
                      <span className="flex items-center gap-2.5">
                        <input type="radio" name="pkg" checked={pkg?.id === p.id} onChange={() => setPkgId(p.id)} />
                        <span><strong className="text-sm">{p.name}</strong><br /><span className="text-[13px] text-[#64748B]">{p.description}</span></span>
                      </span>
                      <strong>{bdt(p.price)}</strong>
                    </label>
                  ))}
                </div>
                {svc.addons.length > 0 && (
                  <>
                    <h3 className="mt-4 text-sm font-semibold">Add-ons (optional)</h3>
                    <div className="mt-2 space-y-2">
                      {svc.addons.map((a) => (
                        <label key={a.id} className="flex cursor-pointer items-center justify-between rounded-[12px] border border-[#E2E8F0] p-3.5">
                          <span className="flex items-center gap-2.5">
                            <input type="checkbox" checked={addonIds.includes(a.id)} onChange={() => setAddonIds((s) => s.includes(a.id) ? s.filter((x) => x !== a.id) : [...s, a.id])} />
                            <span className="text-sm">{a.name}</span>
                          </span>
                          <strong className="text-sm">+{bdt(a.price)}</strong>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </Card>
            )}

            {step === 1 && (
              <Card className="p-5">
                <h3 className="text-sm font-semibold">Pick a date</h3>
                <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {days.map((d) => (
                    <button key={d} onClick={() => setDate(d)} className={`rounded-[10px] border p-2 text-center ${date === d ? "border-[#2563EB] bg-[#EFF6FF]" : "border-[#E2E8F0]"}`}>
                      <span className="block text-[11px] text-[#64748B]">{new Date(d).toLocaleDateString("en-US", { weekday: "short" })}</span>
                      <span className="block text-sm font-bold">{new Date(d).getDate()}</span>
                      <span className="block text-[11px] text-[#64748B]">{new Date(d).toLocaleDateString("en-US", { month: "short" })}</span>
                    </button>
                  ))}
                </div>
                <h3 className="mt-4 text-sm font-semibold">Available time slots</h3>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {timeSlots.map((t) => {
                    const taken = bookings.some((b) => b.providerId === prov.id && b.date === date && b.timeSlot === t && !["Cancelled", "Declined"].includes(b.bookingStatus));
                    return (
                      <button key={t} disabled={!date || taken} onClick={() => setSlot(t)}
                        className={`rounded-[10px] border px-3 py-2.5 text-sm ${slot === t ? "border-[#2563EB] bg-[#EFF6FF] font-semibold text-[#2563EB]" : "border-[#E2E8F0]"} ${taken ? "bg-slate-100 text-slate-400 line-through" : ""}`}>
                        {t}{taken ? " (taken)" : ""}
                      </button>
                    );
                  })}
                </div>
                {svc.mode === "either" && (
                  <div className="mt-4">
                    <Label>Service mode</Label>
                    <Select value={mode} onChange={(e) => setMode(e.target.value as "onsite" | "remote")}>
                      <option value="onsite">On-site visit</option><option value="remote">Remote / video</option>
                    </Select>
                  </div>
                )}
                <p className="mt-3 text-xs text-[#64748B]">Working hours {prov.workingHours} · past dates disabled · taken demo slots crossed out.</p>
              </Card>
            )}

            {step === 2 && (
              <Card className="space-y-4 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Full name</Label><Input value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} /></div>
                  <div><Label>Phone</Label><Input value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} placeholder="+880 1XXX-XXXXXX" /></div>
                  <div><Label>City / District</Label><Select value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })}>{bdCities.map((c) => <option key={c}>{c}</option>)}</Select></div>
                  <div><Label>Area</Label><Select value={addr.area} onChange={(e) => setAddr({ ...addr, area: e.target.value })}>{dhakaAreas.map((a) => <option key={a}>{a}</option>)}</Select></div>
                </div>
                {(svc.mode !== "remote" && !(svc.mode === "either" && mode === "remote")) ? (
                  <div><Label>House, Road, Street address</Label><Input value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} placeholder="House 12, Road 5, Dhanmondi" /></div>
                ) : (
                  <p className="rounded-[10px] bg-slate-50 p-3 text-[13px] text-[#64748B]">Remote service — meeting link will be shared in Messages after confirmation (demo).</p>
                )}
                <div><Label>Additional instructions (optional)</Label><Textarea value={addr.notes} onChange={(e) => setAddr({ ...addr, notes: e.target.value })} placeholder="Gate code, parking, pet at home…" /></div>
                <div>
                  <Label>Attach a photo (optional, demo preview)</Label>
                  <Input type="file" accept="image/*" onChange={() => toast({ title: "Photo attached", desc: "Preview only — stored with booking (demo).", kind: "info" })} />
                </div>
              </Card>
            )}

            {step === 3 && (
              <Card className="p-5">
                <h3 className="font-semibold">Order summary</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-[#64748B]">{pkg?.name}</dt><dd className="font-medium">{bdt(basePrice)}</dd></div>
                  {addonsTotal > 0 && <div className="flex justify-between"><dt className="text-[#64748B]">Add-ons</dt><dd className="font-medium">{bdt(addonsTotal)}</dd></div>}
                  {discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Discount {appliedCoupon && `(${appliedCoupon})`}</dt><dd>−{bdt(discount)}</dd></div>}
                  <div className="flex justify-between"><dt className="text-[#64748B]">Platform service fee ({settings.platformFeePercent}%)</dt><dd className="font-medium">{bdt(totals.platformFee)}</dd></div>
                  <div className="flex justify-between border-t border-[#E2E8F0] pt-2 text-base font-bold"><dt>Total</dt><dd>{bdt(totals.total)}</dd></div>
                  <p className="text-xs text-[#64748B]">Provider receives {bdt(totals.providerNet)} (demo split). Fee policy applied consistently everywhere.</p>
                </dl>
                <div className="mt-4">
                  <Label>Coupon code (try WELCOME10 or FLAT200)</Label>
                  <div className="flex gap-2">
                    <Input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Enter code" />
                    <Button variant="outline" onClick={applyCoupon}><Tag className="h-4 w-4" /> Apply</Button>
                  </div>
                  <FieldError msg={couponErr} />
                  {appliedCoupon && <p className="mt-1 text-[13px] text-emerald-600">Applied: {appliedCoupon} <button className="underline" onClick={() => setAppliedCoupon(null)}>remove</button></p>}
                </div>
              </Card>
            )}

            {step === 4 && (
              <Card className="p-5">
                <h3 className="font-semibold">Payment method <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">SIMULATED</span></h3>
                <p className="mt-1 text-[13px] text-[#64748B]">No real credentials collected; no real charge occurs.</p>
                <div className="mt-3 space-y-2">
                  {paymentMethods.map((m) => (
                    <label key={m} className={`flex cursor-pointer items-center gap-2.5 rounded-[12px] border p-3.5 text-sm ${method === m ? "border-[#2563EB] bg-[#EFF6FF]" : "border-[#E2E8F0]"}`}>
                      <input type="radio" name="pay" checked={method === m} onChange={() => setMethod(m)} />
                      <span className="font-medium">{m}</span>
                      <span className="ml-auto text-xs text-[#64748B]">{m === "Cash on Service" ? "Pay after job" : "Simulated online"}</span>
                    </label>
                  ))}
                </div>
              </Card>
            )}

            <div className="mt-4 flex justify-between">
              <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
              {step < 4 ? (
                <Button onClick={() => {
                  const err = canNext();
                  if (err) { toast({ title: "Incomplete step", desc: err, kind: "error" }); return; }
                  setStep((s) => s + 1);
                }}>Continue <ArrowRight className="h-4 w-4" /></Button>
              ) : (
                <Button onClick={confirm} disabled={submitting}>{submitting ? "Confirming…" : `Confirm Booking · ${bdt(totals.total)}`}</Button>
              )}
            </div>
            {!user && <p className="mt-3 text-center text-[13px] text-[#64748B]">You&apos;ll be asked to log in (demo) before confirming. <Link href="/login" className="text-[#2563EB]">Log in</Link></p>}
          </div>

          <aside>
            <Card className="p-5 lg:sticky lg:top-20">
              <h3 className="text-sm font-semibold">{svc.title}</h3>
              <p className="text-xs text-[#64748B]">{pkg?.name} · {prov.name}</p>
              <dl className="mt-3 space-y-1.5 border-t border-[#E2E8F0] pt-3 text-[13px]">
                <div className="flex justify-between"><dt className="text-[#64748B]">Subtotal</dt><dd>{bdt(totals.subtotal + totals.addonTotal)}</dd></div>
                {totals.discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Discount</dt><dd>−{bdt(totals.discount)}</dd></div>}
                <div className="flex justify-between"><dt className="text-[#64748B]">Fee</dt><dd>{bdt(totals.platformFee)}</dd></div>
                <div className="flex justify-between font-bold"><dt>Total</dt><dd>{bdt(totals.total)}</dd></div>
              </dl>
              <p className="mt-2 text-[11px] text-[#94A3B8]">Calculated live from package + add-ons − discount + {settings.platformFeePercent}% fee.</p>
            </Card>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

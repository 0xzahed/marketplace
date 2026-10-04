"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, FieldError, Textarea, Select } from "@/components/ui/input";
import { useApp } from "@/store/app-store";
import { useToast } from "@/components/ui/toaster";
import { bdCities, dhakaAreas } from "@/data/seed";
import { uid } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(3, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(11, "Enter a valid BD phone (e.g. +880 1XXX-XXXXXX)"),
  title: z.string().min(3, "Enter your professional title"),
  bio: z.string().min(20, "Tell customers about yourself (min 20 chars)"),
  experience: z.coerce.number().min(0).max(50),
  city: z.string().min(1, "Select city"),
  area: z.string().min(1, "Select area"),
});

const STEPS = ["Account", "Professional Info", "Areas & Docs", "Review & Submit"];

export default function BecomeProvider() {
  const [step, setStep] = useState(0);
  const [cats, setCats] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const categories = useApp((s) => s.categories);
  const providers = useApp((s) => s.providers);
  const updateProvider = useApp((s) => s.updateProvider);

  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", title: "", bio: "", experience: 1, city: "Dhaka", area: "Dhanmondi" },
  });

  const next = async () => {
    const ok = step === 1 ? await trigger(["title", "bio", "experience"]) : step === 0 ? await trigger(["name", "email", "phone"]) : true;
    if (ok) setStep((s) => Math.min(s + 1, 3));
  };

  const submit = handleSubmit((v) => {
    // Simulate creating a provider in Pending Verification
    toast({ title: "Application submitted", desc: "Your profile is Pending Verification (demo).", kind: "success" });
    router.push("/login");
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Grow Your Service Business with Fixora</h1>
        <p className="mt-1 text-sm text-[#64748B]">10-step onboarding compressed into 4 demo steps. Documents are previewed locally only — never uploaded.</p>
        <div className="mt-6 flex gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full ${i <= step ? "bg-[#2563EB]" : "bg-slate-200"}`} />
              <p className={`mt-1 text-[11px] ${i <= step ? "font-semibold text-[#2563EB]" : "text-[#94A3B8]"}`}>{i + 1}. {s}</p>
            </div>
          ))}
        </div>
        <Card className="mt-6 p-6">
          {step === 0 && (
            <div className="space-y-4">
              <div><Label>Full name</Label><Input {...register("name")} placeholder="e.g. Kamal Hossain" /><FieldError msg={errors.name?.message} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Email</Label><Input {...register("email")} placeholder="you@example.com" /><FieldError msg={errors.email?.message} /></div>
                <div><Label>Phone</Label><Input {...register("phone")} placeholder="+880 1XXX-XXXXXX" /><FieldError msg={errors.phone?.message} /></div>
              </div>
              <div>
                <Label>Profile photo (local preview only)</Label>
                <Input type="file" accept="image/*" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setPhoto(URL.createObjectURL(f));
                }} />
                {photo && <img src={photo} alt="Preview" className="mt-2 h-20 w-20 rounded-full object-cover" />}
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <div><Label>Professional title</Label><Input {...register("title")} placeholder="e.g. Master Electrician" /><FieldError msg={errors.title?.message} /></div>
              <div><Label>Biography</Label><Textarea {...register("bio")} placeholder="Experience, specialties, guarantees…" /><FieldError msg={errors.bio?.message} /></div>
              <div><Label>Years of experience</Label><Input type="number" {...register("experience")} /><FieldError msg={errors.experience?.message} /></div>
              <div>
                <Label>Service categories (pick at least one)</Label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {categories.slice(0, 8).map((c) => (
                    <button key={c.id} type="button" onClick={() => setCats((s) => s.includes(c.id) ? s.filter((x) => x !== c.id) : [...s, c.id])}
                      className={`rounded-full border px-3 py-1.5 text-[13px] ${cats.includes(c.id) ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]" : "border-[#E2E8F0]"}`}>{c.name}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>City / Division</Label><Select {...register("city")}>{bdCities.map((c) => <option key={c}>{c}</option>)}</Select></div>
                <div><Label>Service area</Label><Select {...register("area")}>{dhakaAreas.map((a) => <option key={a}>{a}</option>)}</Select></div>
              </div>
              <div>
                <Label>NID / trade documents (simulated — local preview only)</Label>
                <Input type="file" accept="image/*,.pdf" multiple onChange={() => toast({ title: "Files selected", desc: "Preview only — nothing uploaded (demo).", kind: "info" })} />
                <p className="mt-1 text-xs text-[#64748B]">New providers start with <strong>Pending Verification</strong> status.</p>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="rounded-[12px] bg-slate-50 p-4 text-sm">
              <p><strong>Name:</strong> {getValues("name") || "—"}</p>
              <p><strong>Title:</strong> {getValues("title") || "—"}</p>
              <p><strong>Contact:</strong> {getValues("email")} · {getValues("phone")}</p>
              <p><strong>Areas:</strong> {getValues("city")} · {getValues("area")}</p>
              <p><strong>Categories:</strong> {cats.length} selected</p>
              <p className="mt-2 text-[#64748B]">Submitting creates a demo application with Pending Verification. Admins approve it under Admin → Provider Verification.</p>
            </div>
          )}
          <div className="mt-6 flex justify-between">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Button>
            {step < 3 ? <Button onClick={next}>Save & Continue</Button> : <Button onClick={submit}>Submit for Review</Button>}
          </div>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}

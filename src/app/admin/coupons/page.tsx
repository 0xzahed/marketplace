"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminShell } from "@/app/admin/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError, Select } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";
import { bdt } from "@/lib/formatters";

const schema = z.object({
  code: z.string().min(3, "Min 3 chars").transform((s) => s.toUpperCase()),
  type: z.enum(["percent", "flat"]),
  value: z.coerce.number().min(1),
  minAmount: z.coerce.number().min(0),
  maxDiscount: z.coerce.number().min(1),
  expiry: z.string().min(1),
  usageLimit: z.coerce.number().min(1),
});

export default function CouponsPage() {
  const coupons = useApp((s) => s.coupons);
  const add = useApp((s) => s.addCoupon);
  const toggle = useApp((s) => s.toggleCoupon);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit((v) => {
    if (coupons.some((c) => c.code === v.code)) { toast({ title: "Code already exists", kind: "error" }); return; }
    add({ code: v.code, type: v.type, value: v.value, minAmount: v.minAmount, maxDiscount: v.maxDiscount, start: new Date().toISOString(), expiry: new Date(v.expiry).toISOString(), usageLimit: v.usageLimit, used: 0, active: true });
    toast({ title: `Coupon ${v.code} created`, kind: "success" });
    reset();
  });

  return (
    <AdminShell title="Coupons & Promotions" breadcrumb={["Admin", "Coupons"]}>
      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <Card className="h-fit p-5">
          <h3 className="font-semibold">New demo coupon</h3>
          <form onSubmit={onSubmit} className="mt-3 space-y-3">
            <div><Label>Code</Label><Input {...register("code")} placeholder="MEGA20" /><FieldError msg={errors.code?.message} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Type</Label><Select {...register("type")}><option value="percent">Percent %</option><option value="flat">Flat ৳</option></Select></div>
              <div><Label>Value</Label><Input type="number" {...register("value")} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Min order ৳</Label><Input type="number" {...register("minAmount")} /></div>
              <div><Label>Max discount ৳</Label><Input type="number" {...register("maxDiscount")} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Expiry</Label><Input type="date" {...register("expiry")} /><FieldError msg={errors.expiry?.message} /></div>
              <div><Label>Usage limit</Label><Input type="number" {...register("usageLimit")} /></div>
            </div>
            <Button className="w-full">Create Coupon</Button>
          </form>
        </Card>
        <div className="space-y-2.5">
          {coupons.map((c) => (
            <Card key={c.code} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-mono font-bold">{c.code} {!c.active && <span className="font-sans text-xs font-medium text-slate-400">(inactive)</span>}</p>
                <p className="text-[13px] text-[#64748B]">{c.type === "percent" ? `${c.value}%` : bdt(c.value)} off · min {bdt(c.minAmount)} · cap {bdt(c.maxDiscount)} · {c.used}/{c.usageLimit} used</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toggle(c.code)}>{c.active ? "Deactivate" : "Activate"}</Button>
            </Card>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

"use client";
import { useForm } from "react-hook-form";
import { AdminShell } from "@/app/admin/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";

export default function AdminSettings() {
  const settings = useApp((s) => s.settings);
  const update = useApp((s) => s.updateSettings);
  const { toast } = useToast();
  const { register, handleSubmit } = useForm({ values: { ...settings } });
  return (
    <AdminShell title="Platform Settings" breadcrumb={["Admin", "Settings"]}>
      <form onSubmit={handleSubmit((v) => { update({ ...v, platformFeePercent: Number(v.platformFeePercent), cancellationHours: Number(v.cancellationHours) }); toast({ title: "Settings saved — applied across checkout & dashboards", kind: "success" }); })} className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3 p-5">
          <h3 className="font-semibold">General</h3>
          <div><Label>Site name</Label><Input {...register("siteName")} /></div>
          <div><Label>Support email</Label><Input {...register("supportEmail")} /></div>
          <div><Label>Support phone</Label><Input {...register("supportPhone")} /></div>
          <div><Label>Currency</Label><Input {...register("currency")} /></div>
          <div className="flex items-center gap-2 rounded-[10px] border border-[#E2E8F0] p-3 text-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#2563EB] font-bold text-white">F</span>
            Logo preview · {settings.siteName}
          </div>
        </Card>
        <Card className="space-y-3 p-5">
          <h3 className="font-semibold">Business rules</h3>
          <div><Label>Platform fee % (applied at checkout)</Label><Input type="number" {...register("platformFeePercent")} /></div>
          <div><Label>Free cancellation window (hours)</Label><Input type="number" {...register("cancellationHours")} /></div>
          <label className="flex items-center justify-between rounded-[10px] border border-[#E2E8F0] px-3.5 py-2.5 text-sm">Reviews enabled<input type="checkbox" {...register("reviewEnabled")} className="h-4 w-4 accent-[#2563EB]" /></label>
          <label className="flex items-center justify-between rounded-[10px] border border-[#E2E8F0] px-3.5 py-2.5 text-sm">Maintenance mode<input type="checkbox" {...register("maintenanceMode")} className="h-4 w-4 accent-[#2563EB]" /></label>
          <Button>Save Settings</Button>
        </Card>
      </form>
    </AdminShell>
  );
}

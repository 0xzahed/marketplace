"use client";
import { useState } from "react";
import { ProviderShell } from "@/app/provider/shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";

export default function ProviderSettings() {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState({ bookingAlerts: true, sms: true, payoutEmail: true });
  return (
    <ProviderShell title="Settings" breadcrumb={["Provider", "Settings"]}>
      <Card className="max-w-xl p-5">
        <h3 className="font-semibold">Booking & payout alerts</h3>
        {Object.entries(prefs).map(([k, v]) => (
          <label key={k} className="mt-2 flex items-center justify-between rounded-[10px] border border-[#E2E8F0] px-3.5 py-2.5 text-sm capitalize">
            {k}<input type="checkbox" checked={v} onChange={() => setPrefs({ ...prefs, [k]: !v })} className="h-4 w-4 accent-[#2563EB]" />
          </label>
        ))}
        <Button className="mt-3" size="sm" onClick={() => toast({ title: "Settings saved", kind: "success" })}>Save</Button>
      </Card>
    </ProviderShell>
  );
}

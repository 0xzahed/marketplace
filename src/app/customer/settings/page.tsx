"use client";
import { useState } from "react";
import { CustomerShell } from "@/app/customer/shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useApp } from "@/store/app-store";
import { useToast } from "@/components/ui/toaster";

export default function SettingsPage() {
  const reset = useApp((s) => s.resetDemo);
  const { toast } = useToast();
  const [prefs, setPrefs] = useState({ email: true, sms: true, push: false });
  const [pw, setPw] = useState({ cur: "", next: "", confirm: "" });
  return (
    <CustomerShell title="Settings" breadcrumb={["Customer", "Settings"]}>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold">Notification preferences</h3>
          {Object.entries(prefs).map(([k, v]) => (
            <label key={k} className="mt-2.5 flex items-center justify-between rounded-[10px] border border-[#E2E8F0] px-3.5 py-2.5 text-sm capitalize">
              {k} notifications
              <input type="checkbox" checked={v} onChange={() => setPrefs({ ...prefs, [k]: !v })} className="h-4 w-4 accent-[#2563EB]" />
            </label>
          ))}
          <Button className="mt-3" size="sm" onClick={() => toast({ title: "Preferences saved", kind: "success" })}>Save Preferences</Button>
        </Card>
        <Card className="space-y-3 p-5">
          <h3 className="font-semibold">Change password (demo)</h3>
          <div><Label>Current password</Label><Input type="password" value={pw.cur} onChange={(e) => setPw({ ...pw, cur: e.target.value })} /></div>
          <div><Label>New password</Label><Input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></div>
          <div><Label>Confirm new password</Label><Input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} /></div>
          <Button size="sm" onClick={() => {
            if (pw.next.length < 6) { toast({ title: "Too short", desc: "Minimum 6 characters.", kind: "error" }); return; }
            if (pw.next !== pw.confirm) { toast({ title: "Mismatch", desc: "Passwords do not match.", kind: "error" }); return; }
            toast({ title: "Password changed (demo)", kind: "success" }); setPw({ cur: "", next: "", confirm: "" });
          }}>Update Password</Button>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold">Demo data</h3>
          <p className="mt-1 text-sm text-[#64748B]">Reset all bookings, messages, reviews and listings to the original sample dataset.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => { reset(); toast({ title: "Demo data reset", kind: "success" }); }}>Reset Demo Data</Button>
        </Card>
      </div>
    </CustomerShell>
  );
}

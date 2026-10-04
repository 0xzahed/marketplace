"use client";
import { useState } from "react";
import { ProviderShell, useMyProvider } from "@/app/provider/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";
import { bdt, fmtDate } from "@/lib/formatters";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function EarningsPage() {
  const me = useMyProvider();
  const bookings = useApp((s) => s.bookings);
  const txns = useApp((s) => s.transactions);
  const { toast } = useToast();
  const [payout, setPayout] = useState(false);

  const mine = bookings.filter((b) => b.providerId === me?.id && b.bookingStatus === "Completed");
  const gross = mine.reduce((s, b) => s + b.price.total, 0);
  const fees = mine.reduce((s, b) => s + b.price.platformFee, 0);
  const net = mine.reduce((s, b) => s + b.price.providerNet, 0);
  const myTx = txns.filter((t) => t.providerId === me?.id);

  const chart = [
    { m: "Apr", gross: 4600, net: 4200 }, { m: "May", gross: 7500, net: 6800 },
    { m: "Jun", gross: 5900, net: 5400 }, { m: "Jul", gross: 8900, net: 8100 },
    { m: "Aug", gross: 8000, net: 7300 }, { m: "Sep", gross: gross || 10100, net: net || 9200 },
  ];

  return (
    <ProviderShell title="Earnings" breadcrumb={["Provider", "Earnings"]}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Gross earnings", bdt(gross)], ["Platform fees", bdt(fees)], ["Net earnings", bdt(net)],
          ["Pending settlement", bdt(Math.round(net * 0.15))], ["Paid out", bdt(Math.round(net * 0.85))],
        ].map(([l, v]) => (
          <Card key={l} className="p-4"><p className="text-xs text-[#64748B]">{l}</p><p className="mt-0.5 text-lg font-bold">{v}</p></Card>
        ))}
      </div>
      <Card className="mt-4 p-5">
        <h3 className="font-semibold">Revenue trend (demo)</h3>
        <div className="mt-2 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart}>
              <XAxis dataKey="m" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => bdt(Number(v))} />
              <Line type="monotone" dataKey="gross" stroke="#94A3B8" name="Gross" />
              <Line type="monotone" dataKey="net" stroke="#2563EB" strokeWidth={2} name="Net" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="mt-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Transaction history</h3>
          <Button size="sm" onClick={() => { setPayout(true); toast({ title: "Payout requested (demo)", desc: "Status: Pending — no real transfer.", kind: "success" }); }}>
            {payout ? "Payout Pending…" : "Request Payout"}
          </Button>
        </div>
        <div className="mt-3 space-y-2">
          {myTx.length === 0 && <p className="text-sm text-[#64748B]">No transactions yet.</p>}
          {myTx.map((t) => (
            <div key={t.id} className="flex flex-wrap items-center gap-2 rounded-[10px] border border-[#E2E8F0] px-3.5 py-2.5 text-sm">
              <span className="font-medium">{t.reference}</span>
              <span className="text-[#64748B]">{t.bookingReference} · {fmtDate(t.date)}</span>
              <span className="ml-auto font-semibold">{bdt(t.net)}</span>
              <PaymentStatusBadge status={t.status} />
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-[#64748B]">Consistent rule: gross = customer total · fee = 10% · net = gross − fee.</p>
      </Card>
    </ProviderShell>
  );
}

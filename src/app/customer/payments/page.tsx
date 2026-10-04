"use client";
import Link from "next/link";
import { CustomerShell } from "@/app/customer/shell";
import { useApp } from "@/store/app-store";
import { useAuth } from "@/features/auth/auth-context";
import { Card } from "@/components/ui/card";
import { PaymentStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { bdt, fmtDate } from "@/lib/formatters";
import { useToast } from "@/components/ui/toaster";

export default function PaymentsPage() {
  const { user } = useAuth();
  const txns = useApp((s) => s.transactions);
  const { toast } = useToast();
  const mine = user ? txns.filter((t) => t.customerId === user.id) : [];
  return (
    <CustomerShell title="Payments" breadcrumb={["Customer", "Payments"]}>
      <Card className="overflow-hidden">
        <p className="border-b border-[#E2E8F0] bg-amber-50 px-4 py-2 text-xs text-amber-800">Demo transactions — simulated bKash / Nagad / Rocket / Card / Cash. No real money moves.</p>
        <div className="hidden grid-cols-[1fr_1fr_0.7fr_0.8fr_0.9fr] gap-2 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-[#64748B] md:grid">
          <span>Transaction</span><span>Booking</span><span>Amount</span><span>Method</span><span>Status</span>
        </div>
        {mine.length === 0 && <div className="p-4"><EmptyState title="No payments yet" /></div>}
        {mine.map((t) => (
          <div key={t.id} className="grid gap-1 border-t border-[#E2E8F0] px-4 py-3 text-sm md:grid-cols-[1fr_1fr_0.7fr_0.8fr_0.9fr] md:items-center">
            <div><p className="font-medium">{t.reference}</p><p className="text-xs text-[#64748B]">{fmtDate(t.date)}</p></div>
            <p className="text-[13px]">{t.bookingReference}</p>
            <p className="font-semibold">{bdt(t.gross)}</p>
            <p className="text-[13px]">{t.method}</p>
            <div className="flex items-center gap-2">
              <PaymentStatusBadge status={t.status} />
              <Button size="sm" variant="ghost" onClick={() => toast({ title: t.reference, desc: `Gross ${bdt(t.gross)} · Fee ${bdt(t.platformFee)} · Net ${bdt(t.net)} · ${t.method} · ${t.status}`, kind: "info" })}>Receipt</Button>
            </div>
          </div>
        ))}
      </Card>
      <p className="mt-3 text-xs text-[#64748B]">Receipt shows the consistent split: gross = customer total, platform revenue = fee, provider net = gross − fee.</p>
    </CustomerShell>
  );
}

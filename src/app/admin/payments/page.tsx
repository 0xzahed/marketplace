"use client";
import { AdminShell } from "@/app/admin/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";
import { bdt, fmtDate } from "@/lib/formatters";

export default function AdminPayments() {
  const txns = useApp((s) => s.transactions);
  const { toast } = useToast();
  return (
    <AdminShell title="Payments" breadcrumb={["Admin", "Payments"]}>
      <Card className="overflow-x-auto">
        <p className="border-b border-[#E2E8F0] bg-amber-50 px-4 py-2 text-xs text-amber-800">Simulated ledger — refunds and payouts change demo status only, never move real money.</p>
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead><tr className="bg-slate-50 text-xs text-[#64748B]">
            <th className="px-4 py-2.5">Txn</th><th className="px-4 py-2.5">Booking</th><th className="px-4 py-2.5">Gross</th><th className="px-4 py-2.5">Fee</th><th className="px-4 py-2.5">Net</th><th className="px-4 py-2.5">Method</th><th className="px-4 py-2.5">Status</th><th className="px-4 py-2.5">Action</th>
          </tr></thead>
          <tbody>
            {txns.map((t) => (
              <tr key={t.id} className="border-t border-[#E2E8F0]">
                <td className="px-4 py-2.5 font-medium">{t.reference}<br /><span className="text-xs font-normal text-[#64748B]">{fmtDate(t.date)}</span></td>
                <td className="px-4 py-2.5 text-[13px]">{t.bookingReference}</td>
                <td className="px-4 py-2.5">{bdt(t.gross)}</td>
                <td className="px-4 py-2.5">{bdt(t.platformFee)}</td>
                <td className="px-4 py-2.5 font-semibold">{bdt(t.net)}</td>
                <td className="px-4 py-2.5 text-[13px]">{t.method}</td>
                <td className="px-4 py-2.5"><PaymentStatusBadge status={t.status} /></td>
                <td className="px-4 py-2.5">
                  {(t.status === "Paid" || t.status === "Refund Pending") && (
                    <Button size="sm" variant="outline" onClick={() => toast({ title: "Refund reviewed (demo)", desc: `${t.reference} marked Refunded — simulated.`, kind: "success" })}>Review Refund</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  );
}

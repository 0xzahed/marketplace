import { cn } from "@/lib/utils";

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", className)}>
      {children}
    </span>
  );
}

export function BookingStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 border border-amber-200",
    Confirmed: "bg-blue-50 text-blue-700 border border-blue-200",
    "In Progress": "bg-violet-50 text-violet-700 border border-violet-200",
    Completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Cancelled: "bg-slate-100 text-slate-600 border border-slate-200",
    Declined: "bg-red-50 text-red-700 border border-red-200",
  };
  return <Badge className={map[status] ?? "bg-slate-100 text-slate-600"}>{status}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Unpaid: "bg-slate-100 text-slate-600 border border-slate-200",
    Pending: "bg-amber-50 text-amber-700 border border-amber-200",
    Failed: "bg-red-50 text-red-700 border border-red-200",
    "Refund Pending": "bg-orange-50 text-orange-700 border border-orange-200",
    Refunded: "bg-blue-50 text-blue-700 border border-blue-200",
  };
  return <Badge className={map[status] ?? "bg-slate-100 text-slate-600"}>{status}</Badge>;
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] font-semibold text-[#2563EB]">
      <svg viewBox="0 0 20 20" className="h-3 w-3 fill-current"><path d="M10 0l2.4 2.1 3.1-.5 1.1 3 3 1.1-.5 3.1L21 11l-2.1 2.4.5 3.1-3 1.1-1.1 3-3.1-.5L10 22l-2.4-2.1-3.1.5-1.1-3-3-1.1.5-3.1L0 11l2.1-2.4-.5-3.1 3-1.1 1.1-3 3.1.5z" transform="scale(.95)" /><path fill="#fff" d="M8.5 13.5l-3-3 1.2-1.2 1.8 1.8 4.8-4.8 1.2 1.2z" /></svg>
      Verified
    </span>
  );
}

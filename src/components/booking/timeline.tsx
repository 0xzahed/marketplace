import type { Booking } from "@/types";
import { CheckCircle2, Circle } from "lucide-react";

const STEPS: Booking["bookingStatus"][] = ["Pending", "Confirmed", "In Progress", "Completed"];

export function BookingTimeline({ status, cancelled }: { status: Booking["bookingStatus"]; cancelled?: string }) {
  if (status === "Cancelled" || status === "Declined") {
    return (
      <div className="rounded-[12px] border border-red-200 bg-red-50 p-4 text-sm">
        <p className="font-semibold text-red-700">Booking {status}</p>
        {cancelled && <p className="mt-1 text-red-600">Reason: {cancelled}</p>}
      </div>
    );
  }
  const idx = STEPS.indexOf(status);
  return (
    <ol className="flex flex-col gap-0" aria-label="Booking progress">
      {STEPS.map((s, i) => (
        <li key={s} className="flex gap-3">
          <div className="flex flex-col items-center">
            {i <= idx ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-300" />}
            {i < STEPS.length - 1 && <span className={`h-6 w-0.5 ${i < idx ? "bg-emerald-300" : "bg-slate-200"}`} />}
          </div>
          <p className={`pb-4 text-sm ${i <= idx ? "font-medium text-[#0F172A]" : "text-[#94A3B8]"}`}>{s}</p>
        </li>
      ))}
    </ol>
  );
}

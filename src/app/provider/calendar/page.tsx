"use client";
import { useState } from "react";
import { ProviderShell, useMyProvider } from "@/app/provider/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { bdt } from "@/lib/formatters";

const DAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

export default function CalendarPage() {
  const me = useMyProvider();
  const bookings = useApp((s) => s.bookings);
  const { toast } = useToast();
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [blocked, setBlocked] = useState<string[]>(["2026-10-09"]);
  const [hours, setHours] = useState(me?.workingHours ?? "9:00 AM – 9:00 PM");

  const mine = bookings.filter((b) => b.providerId === me?.id && !["Cancelled", "Declined"].includes(b.bookingStatus));

  // current month grid (demo: October 2026)
  const cells = Array.from({ length: 35 }).map((_, i) => {
    const day = i - 2; // offset so Oct 1 lands correctly-ish
    const date = day >= 1 && day <= 31 ? `2026-10-${String(day).padStart(2, "0")}` : "";
    const jobs = mine.filter((b) => b.date === date);
    return { date, day, jobs };
  });

  return (
    <ProviderShell title="Calendar & Availability" breadcrumb={["Provider", "Calendar"]}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {(["month", "week", "day"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} className={`rounded-full px-4 py-1.5 text-[13px] font-medium capitalize ${view === v ? "bg-[#0F172A] text-white" : "border border-[#E2E8F0] bg-white"}`}>{v}</button>
        ))}
        <span className="ml-auto text-sm text-[#64748B]">October 2026 (demo month)</span>
      </div>

      {view === "month" && (
        <Card className="p-4">
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#64748B]">
            {DAYS.map((d) => <span key={d} className="py-1">{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((c, i) => (
              <button
                key={i}
                disabled={!c.date}
                onClick={() => {
                  if (!c.date) return;
                  setBlocked((b) => b.includes(c.date) ? b.filter((x) => x !== c.date) : [...b, c.date]);
                  toast({ title: blocked.includes(c.date) ? "Date unblocked" : "Date blocked", desc: c.date, kind: "success" });
                }}
                className={`min-h-[64px] rounded-[10px] border p-1 text-left text-xs ${!c.date ? "border-transparent" : blocked.includes(c.date) ? "border-red-200 bg-red-50" : c.jobs.length ? "border-blue-200 bg-[#EFF6FF]" : "border-[#E2E8F0]"}`}
              >
                {c.date && (
                  <>
                    <strong className="block">{c.day}</strong>
                    {blocked.includes(c.date) && <span className="text-red-600">Blocked</span>}
                    {c.jobs.slice(0, 2).map((j) => <span key={j.id} className="block truncate text-blue-700">{j.timeSlot}</span>)}
                    {c.jobs.length > 2 && <span className="text-[#64748B]">+{c.jobs.length - 2}</span>}
                  </>
                )}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-[#64748B]">Click a date to block/unblock it (demo). Blocked dates can&apos;t be booked.</p>
        </Card>
      )}

      {view !== "month" && (
        <Card className="p-4">
          <h3 className="font-semibold capitalize">{view} agenda</h3>
          <div className="mt-3 space-y-2">
            {mine.length === 0 && <p className="text-sm text-[#64748B]">No upcoming jobs.</p>}
            {mine.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-[10px] bg-slate-50 px-3.5 py-2.5 text-sm">
                <span>{b.date} · {b.timeSlot} · {b.reference}</span>
                <span className="font-semibold">{bdt(b.price.providerNet)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="mt-4 p-5">
        <h3 className="font-semibold">Working hours</h3>
        <div className="mt-2 flex gap-2">
          <input value={hours} onChange={(e) => setHours(e.target.value)} className="h-10 flex-1 rounded-[10px] border border-[#E2E8F0] px-3 text-sm" />
          <Button onClick={() => toast({ title: "Availability saved (demo)", kind: "success" })}>Save</Button>
        </div>
      </Card>
    </ProviderShell>
  );
}

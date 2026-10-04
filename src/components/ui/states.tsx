import { Inbox } from "lucide-react";

export function EmptyState({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#E2E8F0] bg-white px-6 py-14 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">
        <Inbox className="h-6 w-6 text-[#2563EB]" />
      </span>
      <h3 className="text-[15px] font-semibold text-[#0F172A]">{title}</h3>
      {desc && <p className="mt-1 max-w-sm text-sm text-[#64748B]">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-[16px] bg-slate-200/70 ${className}`} />;
}

export function PageHeader({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-[#0F172A] sm:text-2xl">{title}</h1>
        {desc && <p className="mt-1 text-sm text-[#64748B]">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

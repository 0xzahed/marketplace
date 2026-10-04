"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Bell, ChevronRight, LogOut, Menu, Search, X } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import type { Role } from "@/types";
import { useApp } from "@/store/app-store";
import { Avatar } from "@/components/ui/rating";
import { cn } from "@/lib/utils";

export interface NavItem { label: string; href: string; icon?: ReactNode; badge?: number }

export function DashboardLayout({ role, title, breadcrumb, nav, children }: {
  role: Role; title: string; breadcrumb?: string[]; nav: NavItem[]; children: ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const notifs = useApp((s) => s.notifications);
  const unread = user ? notifs.filter((n) => n.userId === user.id && !n.read).length : 0;

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2 px-5 pt-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#2563EB] font-bold text-white">F</span>
        <span className="font-bold">Fixora</span>
        <span className="ml-1 rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-semibold capitalize text-[#2563EB]">{role}</span>
      </Link>
      <nav className="mt-4 flex-1 space-y-0.5 overflow-y-auto px-3 pb-4" aria-label="Dashboard">
        {nav.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={cn("flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-[#EFF6FF] text-[#2563EB]" : "text-[#475569] hover:bg-slate-100")}
            >
              {n.icon}
              <span className="flex-1">{n.label}</span>
              {n.badge ? <span className="rounded-full bg-[#EF4444] px-1.5 py-0.5 text-[10px] font-bold text-white">{n.badge}</span> : null}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[#E2E8F0] p-3">
        <button
          onClick={() => { logout(); router.push("/"); }}
          className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" /> Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="hidden w-64 shrink-0 border-r border-[#E2E8F0] bg-white lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">{sidebar}</aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-[#E2E8F0] bg-white px-4 sm:px-6">
          <button className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E2E8F0] lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            {breadcrumb && (
              <nav className="hidden items-center gap-1 text-xs text-[#64748B] sm:flex" aria-label="Breadcrumb">
                {breadcrumb.map((b, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight className="h-3 w-3" />}
                    <span className={i === breadcrumb.length - 1 ? "font-medium text-[#0F172A]" : ""}>{b}</span>
                  </span>
                ))}
              </nav>
            )}
            <h1 className="truncate text-base font-bold text-[#0F172A] sm:text-lg">{title}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href={`/${role}/notifications`} className="relative flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E2E8F0] hover:bg-slate-50" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unread > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#EF4444] px-1 text-[10px] font-bold text-white">{unread}</span>}
            </Link>
            {user && <Avatar src={user.avatar} name={user.name} size={36} />}
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

export function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Please log in</h1>
        <p className="mt-2 text-sm text-[#64748B]">This is a frontend prototype with mock authentication. Choose a demo account to continue.</p>
        <button onClick={() => router.push("/login")} className="mt-4 rounded-[10px] bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white">Go to Login</button>
      </div>
    );
  }
  if (!roles.includes(user.role)) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Not authorized</h1>
        <p className="mt-2 text-sm text-[#64748B]">Your demo role ({user.role}) cannot access this area.</p>
        <button onClick={() => router.push("/")} className="mt-4 rounded-[10px] bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white">Back to Home</button>
      </div>
    );
  }
  return <>{children}</>;
}

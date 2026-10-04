"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { ROLE_HOME } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/rating";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Find Services", href: "/services" },
  { label: "Categories", href: "/categories" },
  { label: "Professionals", href: "/providers" },
  { label: "How It Works", href: "/how-it-works" },
];

export function SiteHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Fixora home">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#2563EB] text-lg font-bold text-white">F</span>
          <span className="text-lg font-bold tracking-tight text-[#0F172A]">Fixora</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === n.href || pathname.startsWith(n.href + "/")
                  ? "bg-[#EFF6FF] text-[#2563EB]"
                  : "text-[#334155] hover:bg-slate-100"
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <button
            onClick={() => router.push("/search")}
            className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50"
            aria-label="Search services"
          >
            <Search className="h-4 w-4" />
          </button>
          {!user ? (
            <>
              <Link href="/become-a-provider" className="rounded-[10px] px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-100">
                Become a Provider
              </Link>
              <Link href="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          ) : (
            <div className="relative">
              <button onClick={() => setMenu((v) => !v)} className="flex items-center gap-2 rounded-[10px] border border-[#E2E8F0] px-2 py-1.5 hover:bg-slate-50" aria-haspopup="menu">
                <Avatar src={user.avatar} name={user.name} size={28} />
                <span className="max-w-[120px] truncate text-sm font-medium">{user.name}</span>
                <ChevronDown className="h-4 w-4 text-[#64748B]" />
              </button>
              {menu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-lg">
                    <Link href={ROLE_HOME[user.role]} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100" onClick={() => setMenu(false)}>
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link href={`/${user.role}/profile`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100" onClick={() => setMenu(false)}>
                      <User className="h-4 w-4" /> My Profile
                    </Link>
                    <button
                      onClick={() => { logout(); setMenu(false); router.push("/"); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <button className="ml-auto flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E2E8F0] lg:hidden" onClick={() => setMobile((v) => !v)} aria-label="Toggle menu">
          {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {mobile && (
        <div className="border-t border-[#E2E8F0] bg-white px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setMobile(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-slate-100">
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-[#E2E8F0] pt-3">
              {!user ? (
                <>
                  <Link href="/search" onClick={() => setMobile(false)}><Button variant="outline" className="w-full">Search Services</Button></Link>
                  <Link href="/become-a-provider" onClick={() => setMobile(false)}><Button variant="outline" className="w-full">Become a Provider</Button></Link>
                  <div className="flex gap-2">
                    <Link href="/login" className="flex-1" onClick={() => setMobile(false)}><Button variant="outline" className="w-full">Log In</Button></Link>
                    <Link href="/register" className="flex-1" onClick={() => setMobile(false)}><Button className="w-full">Get Started</Button></Link>
                  </div>
                </>
              ) : (
                <>
                  <Link href={ROLE_HOME[user.role]} onClick={() => setMobile(false)}><Button className="w-full">Go to Dashboard</Button></Link>
                  <Button variant="outline" className="w-full" onClick={() => { logout(); setMobile(false); }}>Log Out</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

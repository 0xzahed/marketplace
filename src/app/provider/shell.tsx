"use client";
import type { ReactNode } from "react";
import {
  LayoutDashboard, Briefcase, CalendarCheck, CalendarDays, MessagesSquare, Users,
  Wallet, Star, Image, ShieldCheck, User, Settings,
} from "lucide-react";
import { DashboardLayout, RequireRole } from "@/components/layout/dashboard-layout";
import { useApp } from "@/store/app-store";
import { useAuth } from "@/features/auth/auth-context";

export function ProviderShell({ title, breadcrumb, children }: { title: string; breadcrumb?: string[]; children: ReactNode }) {
  const { user } = useAuth();
  const providers = useApp((s) => s.providers);
  const bookings = useApp((s) => s.bookings);
  const me = providers.find((p) => p.userId === user?.id) ?? providers[0];
  const pending = me ? bookings.filter((b) => b.providerId === me.id && b.bookingStatus === "Pending").length : 0;
  const nav = [
    { label: "Overview", href: "/provider/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "My Services", href: "/provider/services", icon: <Briefcase className="h-4 w-4" /> },
    { label: "Bookings", href: "/provider/bookings", icon: <CalendarCheck className="h-4 w-4" />, badge: pending || undefined },
    { label: "Calendar", href: "/provider/calendar", icon: <CalendarDays className="h-4 w-4" /> },
    { label: "Messages", href: "/provider/messages", icon: <MessagesSquare className="h-4 w-4" /> },
    { label: "Customers", href: "/provider/customers", icon: <Users className="h-4 w-4" /> },
    { label: "Earnings", href: "/provider/earnings", icon: <Wallet className="h-4 w-4" /> },
    { label: "Reviews", href: "/provider/reviews", icon: <Star className="h-4 w-4" /> },
    { label: "Portfolio", href: "/provider/portfolio", icon: <Image className="h-4 w-4" /> },
    { label: "Verification", href: "/provider/verification", icon: <ShieldCheck className="h-4 w-4" /> },
    { label: "Profile", href: "/provider/profile", icon: <User className="h-4 w-4" /> },
    { label: "Settings", href: "/provider/settings", icon: <Settings className="h-4 w-4" /> },
  ];
  return (
    <RequireRole roles={["provider"]}>
      <DashboardLayout role="provider" title={title} breadcrumb={breadcrumb} nav={nav}>
        {children}
      </DashboardLayout>
    </RequireRole>
  );
}

export function useMyProvider() {
  const { user } = useAuth();
  const providers = useApp((s) => s.providers);
  return providers.find((p) => p.userId === user?.id) ?? providers[0];
}

"use client";
import type { ReactNode } from "react";
import {
  LayoutDashboard, Users, ShieldCheck, Briefcase, Tags, CalendarCheck, CreditCard,
  Star, AlertTriangle, Ticket, BarChart3, Bell, Settings,
} from "lucide-react";
import { DashboardLayout, RequireRole } from "@/components/layout/dashboard-layout";
import { useApp } from "@/store/app-store";

export function AdminShell({ title, breadcrumb, children }: { title: string; breadcrumb?: string[]; children: ReactNode }) {
  const providers = useApp((s) => s.providers);
  const disputes = useApp((s) => s.disputes);
  const pending = providers.filter((p) => p.verificationStatus === "Pending" || p.verificationStatus === "Needs Info").length;
  const openD = disputes.filter((d) => ["Open", "Under Review"].includes(d.status)).length;
  const nav = [
    { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
    { label: "Providers", href: "/admin/providers", icon: <ShieldCheck className="h-4 w-4" />, badge: pending || undefined },
    { label: "Verification", href: "/admin/providers/verification", icon: <ShieldCheck className="h-4 w-4" />, badge: pending || undefined },
    { label: "Services", href: "/admin/services", icon: <Briefcase className="h-4 w-4" /> },
    { label: "Categories", href: "/admin/categories", icon: <Tags className="h-4 w-4" /> },
    { label: "Bookings", href: "/admin/bookings", icon: <CalendarCheck className="h-4 w-4" /> },
    { label: "Payments", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { label: "Reviews", href: "/admin/reviews", icon: <Star className="h-4 w-4" /> },
    { label: "Disputes", href: "/admin/disputes", icon: <AlertTriangle className="h-4 w-4" />, badge: openD || undefined },
    { label: "Coupons", href: "/admin/coupons", icon: <Ticket className="h-4 w-4" /> },
    { label: "Reports", href: "/admin/reports", icon: <BarChart3 className="h-4 w-4" /> },
    { label: "Notifications", href: "/admin/notifications", icon: <Bell className="h-4 w-4" /> },
    { label: "Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
  ];
  return (
    <RequireRole roles={["admin"]}>
      <DashboardLayout role="admin" title={title} breadcrumb={breadcrumb} nav={nav}>
        {children}
      </DashboardLayout>
    </RequireRole>
  );
}

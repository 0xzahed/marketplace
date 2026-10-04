"use client";
import type { ReactNode } from "react";
import {
  LayoutDashboard, CalendarCheck, MessagesSquare, Heart, Star, CreditCard, Bell, User, Settings,
} from "lucide-react";
import { DashboardLayout, RequireRole } from "@/components/layout/dashboard-layout";
import { useApp } from "@/store/app-store";
import { useAuth } from "@/features/auth/auth-context";

export function CustomerShell({ title, breadcrumb, children }: { title: string; breadcrumb?: string[]; children: ReactNode }) {
  const { user } = useAuth();
  const bookings = useApp((s) => s.bookings);
  const convs = useApp((s) => s.conversations);
  const notifs = useApp((s) => s.notifications);
  const mine = user ? bookings.filter((b) => b.customerId === user.id && ["Pending", "Confirmed", "In Progress"].includes(b.bookingStatus)).length : 0;
  const unreadMsg = user ? convs.filter((c) => c.customerId === user.id).reduce((s, c) => s + c.unreadCustomer, 0) : 0;
  const unreadN = user ? notifs.filter((n) => n.userId === user.id && !n.read).length : 0;
  const nav = [
    { label: "Overview", href: "/customer/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "My Bookings", href: "/customer/bookings", icon: <CalendarCheck className="h-4 w-4" />, badge: mine || undefined },
    { label: "Messages", href: "/customer/messages", icon: <MessagesSquare className="h-4 w-4" />, badge: unreadMsg || undefined },
    { label: "Saved Services", href: "/customer/saved", icon: <Heart className="h-4 w-4" /> },
    { label: "Reviews", href: "/customer/reviews", icon: <Star className="h-4 w-4" /> },
    { label: "Payments", href: "/customer/payments", icon: <CreditCard className="h-4 w-4" /> },
    { label: "Notifications", href: "/customer/notifications", icon: <Bell className="h-4 w-4" />, badge: unreadN || undefined },
    { label: "My Profile", href: "/customer/profile", icon: <User className="h-4 w-4" /> },
    { label: "Settings", href: "/customer/settings", icon: <Settings className="h-4 w-4" /> },
  ];
  return (
    <RequireRole roles={["customer"]}>
      <DashboardLayout role="customer" title={title} breadcrumb={breadcrumb} nav={nav}>
        {children}
      </DashboardLayout>
    </RequireRole>
  );
}

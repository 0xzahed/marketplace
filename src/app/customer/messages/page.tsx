"use client";
import { CustomerShell } from "@/app/customer/shell";
import { MessagePanel } from "@/components/messaging/message-panel";
import { useAuth } from "@/features/auth/auth-context";

export default function CustomerMessages() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <CustomerShell title="Messages" breadcrumb={["Customer", "Messages"]}>
      <MessagePanel meId={user.id} meRole="customer" peerRole="provider" />
    </CustomerShell>
  );
}

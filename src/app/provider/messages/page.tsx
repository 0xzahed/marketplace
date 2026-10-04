"use client";
import { ProviderShell } from "@/app/provider/shell";
import { MessagePanel } from "@/components/messaging/message-panel";
import { useMyProvider } from "@/app/provider/shell";

export default function ProviderMessages() {
  const me = useMyProvider();
  if (!me) return null;
  return (
    <ProviderShell title="Messages" breadcrumb={["Provider", "Messages"]}>
      <MessagePanel meId={me.id} meRole="provider" peerRole="customer" />
    </ProviderShell>
  );
}

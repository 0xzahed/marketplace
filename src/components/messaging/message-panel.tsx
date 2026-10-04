"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Send } from "lucide-react";
import { useApp } from "@/store/app-store";
import type { Role } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/rating";
import { EmptyState } from "@/components/ui/states";
import { timeAgo } from "@/lib/formatters";

export function MessagePanel({ meId, meRole, peerRole }: { meId: string; meRole: Role; peerRole: "customer" | "provider" }) {
  const convs = useApp((s) => s.conversations);
  const msgs = useApp((s) => s.messages);
  const providers = useApp((s) => s.providers);
  const users = useApp((s) => s.users);
  const services = useApp((s) => s.services);
  const bookings = useApp((s) => s.bookings);
  const send = useApp((s) => s.sendMessage);
  const markRead = useApp((s) => s.markConversationRead);
  const notify = useApp((s) => s.notify);

  const mine = useMemo(() => {
    return convs.filter((c) => (meRole === "customer" ? c.customerId === meId : c.providerId === meId))
      .sort((a, b) => +new Date(b.lastAt) - +new Date(a.lastAt));
  }, [convs, meId, meRole]);

  const [active, setActive] = useState<string | null>(() => mine[0]?.id ?? null);
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active) markRead(active, meRole === "customer" ? "customer" : "provider");
    bottom.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, msgs.length]);

  const peerOf = (convId: string) => {
    const c = convs.find((x) => x.id === convId);
    if (!c) return null;
    if (meRole === "customer") {
      const p = providers.find((x) => x.id === c.providerId);
      return { id: c.providerId, name: p?.name ?? "Provider", avatar: p?.avatar ?? "", userId: p?.userId ?? "" };
    }
    const u = users.find((x) => x.id === c.customerId);
    return { id: c.customerId, name: u?.name ?? "Customer", avatar: u?.avatar ?? "", userId: u?.id ?? "" };
  };

  const filtered = mine.filter((c) => {
    const peer = peerOf(c.id);
    return !q || peer?.name.toLowerCase().includes(q.toLowerCase()) || c.lastMessage.toLowerCase().includes(q.toLowerCase());
  });

  const activeConv = convs.find((c) => c.id === active);
  const thread = msgs.filter((m) => m.conversationId === active).sort((a, b) => +new Date(a.at) - +new Date(b.at));
  const activeBooking = activeConv?.bookingId ? bookings.find((b) => b.id === activeConv.bookingId) : null;
  const activeService = activeBooking ? services.find((s) => s.id === activeBooking.serviceId) : null;

  const submit = () => {
    if (!draft.trim() || !active) return;
    send(active, meId, meRole, draft.trim());
    const peer = peerOf(active);
    if (peer?.userId) notify({ userId: peer.userId, type: "message", title: `New message`, body: draft.trim().slice(0, 80), link: meRole === "customer" ? "/provider/messages" : "/customer/messages" });
    setDraft("");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <Card className="overflow-hidden">
        <div className="border-b border-[#E2E8F0] p-3">
          <label className="flex items-center gap-2 rounded-[10px] bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-[#64748B]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search conversations" className="w-full bg-transparent text-sm outline-none" />
          </label>
        </div>
        <div className="max-h-[480px] overflow-y-auto">
          {filtered.length === 0 && <p className="p-4 text-sm text-[#64748B]">No conversations yet.</p>}
          {filtered.map((c) => {
            const peer = peerOf(c.id);
            const unread = meRole === "customer" ? c.unreadCustomer : c.unreadProvider;
            return (
              <button key={c.id} onClick={() => setActive(c.id)} className={`flex w-full items-center gap-2.5 border-b border-slate-100 px-3.5 py-3 text-left hover:bg-slate-50 ${active === c.id ? "bg-[#EFF6FF]" : ""}`}>
                <Avatar src={peer?.avatar} name={peer?.name ?? "?"} size={40} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <strong className="truncate text-sm">{peer?.name}</strong>
                    <span className="shrink-0 text-[11px] text-[#94A3B8]">{timeAgo(c.lastAt)}</span>
                  </span>
                  <span className="block truncate text-[13px] text-[#64748B]">{c.lastMessage || "Start the conversation…"}</span>
                </span>
                {unread > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2563EB] px-1 text-[10px] font-bold text-white">{unread}</span>}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="flex min-h-[480px] flex-col overflow-hidden">
        {!active || !activeConv ? (
          <div className="flex-1 p-4"><EmptyState title="Select a conversation" desc="Choose a chat from the list to start messaging (demo shared state)." /></div>
        ) : (
          <>
            <div className="flex items-center gap-2.5 border-b border-[#E2E8F0] p-3.5">
              <Avatar src={peerOf(active as string)?.avatar} name={peerOf(active as string)?.name ?? "?"} size={38} />
              <div><p className="text-sm font-semibold">{peerOf(active as string)?.name}</p><p className="text-xs text-[#64748B]">{peerRole}</p></div>
            </div>
            {activeBooking && (
              <div className="border-b border-[#E2E8F0] bg-slate-50 px-3.5 py-2 text-[13px]">
                Booking <strong>{activeBooking.reference}</strong> · {activeService?.title} · {activeBooking.bookingStatus}
              </div>
            )}
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {thread.length === 0 && <p className="text-center text-sm text-[#64748B]">No messages yet. Say hello!</p>}
              {thread.map((m) => {
                const mineMsg = m.senderId === meId;
                return (
                  <div key={m.id} className={`flex ${mineMsg ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${mineMsg ? "rounded-br-md bg-[#2563EB] text-white" : "rounded-bl-md bg-slate-100 text-[#0F172A]"}`}>
                      <p>{m.text}</p>
                      <p className={`mt-0.5 text-[10px] ${mineMsg ? "text-blue-100" : "text-[#94A3B8]"}`}>{timeAgo(m.at)}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottom} />
            </div>
            <div className="flex gap-2 border-t border-[#E2E8F0] p-3">
              <Input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Type a message…" aria-label="Message input" />
              <Button onClick={submit} aria-label="Send message"><Send className="h-4 w-4" /></Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

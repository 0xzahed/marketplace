"use client";
import { useState } from "react";
import { Button } from "./button";

export function ConfirmDialog({
  open, title, desc, confirmLabel = "Confirm", onConfirm, onClose, danger,
}: {
  open: boolean; title: string; desc?: string; confirmLabel?: string;
  onConfirm: () => void; onClose: () => void; danger?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-md rounded-[16px] bg-white p-6 shadow-xl">
        <h3 className="text-base font-semibold text-[#0F172A]">{title}</h3>
        {desc && <p className="mt-2 text-sm text-[#64748B]">{desc}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant={danger ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

export function useConfirm() {
  const [state, setState] = useState<{ open: boolean; title: string; desc?: string; confirmLabel?: string; danger?: boolean; fn?: () => void }>({
    open: false, title: "",
  });
  const ask = (opts: { title: string; desc?: string; confirmLabel?: string; danger?: boolean; onConfirm: () => void }) =>
    setState({ open: true, title: opts.title, desc: opts.desc, confirmLabel: opts.confirmLabel, danger: opts.danger, fn: opts.onConfirm });
  const dialog = (
    <ConfirmDialog
      open={state.open} title={state.title} desc={state.desc} confirmLabel={state.confirmLabel}
      danger={state.danger} onClose={() => setState((s) => ({ ...s, open: false }))}
      onConfirm={() => state.fn?.()}
    />
  );
  return { ask, dialog };
}

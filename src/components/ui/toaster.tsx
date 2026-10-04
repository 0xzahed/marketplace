"use client";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

type Toast = { id: string; title: string; desc?: string; kind: "success" | "error" | "info" };
const Ctx = createContext<{ toast: (t: Omit<Toast, "id">) => void } | null>(null);

export function useToast() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useToast outside provider");
  return v;
}

let seq = 0;
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = `t${++seq}`;
    setItems((s) => [...s, { ...t, id }]);
    setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), 3400);
  }, []);
  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2">
        {items.map((t) => (
          <div key={t.id} className="flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-lg">
            {t.kind === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" /> : t.kind === "error" ? <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" /> : <Info className="mt-0.5 h-5 w-5 text-blue-500" />}
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">{t.title}</p>
              {t.desc && <p className="text-[13px] text-[#64748B]">{t.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

// Simple Toaster mount: wraps nothing, ToastProvider is mounted in layout via this component
export function Toaster() {
  return null;
}

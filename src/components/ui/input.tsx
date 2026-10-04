"use client";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...p }, ref) => (
    <input
      ref={ref}
      className={cn("h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none", className)}
      {...p}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...p }, ref) => (
    <textarea
      ref={ref}
      className={cn("w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2 text-sm min-h-[90px] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none", className)}
      {...p}
    />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...p }, ref) => (
    <select
      ref={ref}
      className={cn("h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 text-sm focus:border-[#2563EB] focus:outline-none", className)}
      {...p}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-[#0F172A]">{children}</label>;
}

export function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-[#EF4444]">{msg}</p>;
}

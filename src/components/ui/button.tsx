"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm",
  secondary: "bg-[#0F172A] text-white hover:bg-slate-800",
  outline: "border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-slate-50",
  ghost: "text-[#0F172A] hover:bg-slate-100",
  danger: "bg-[#EF4444] text-white hover:bg-red-600",
  success: "bg-[#10B981] text-white hover:bg-emerald-600",
};
const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
  icon: "h-10 w-10",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer whitespace-nowrap",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

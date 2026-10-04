"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, FieldError } from "@/components/ui/input";
import { useAuth } from "@/features/auth/auth-context";
import { ROLE_HOME } from "@/lib/permissions";
import { useToast } from "@/components/ui/toaster";

const schema = z.object({ email: z.string().email("Enter a valid email") });

export default function LoginPage() {
  const { login, loginAs } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [err, setErr] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = handleSubmit(({ email }) => {
    const u = login(email);
    if (!u) { setErr("No demo account with that email. Use a demo button below."); return; }
    toast({ title: `Welcome back, ${u.name.split(" ")[0]}!`, desc: `Logged in as ${u.role} (mock auth).`, kind: "success" });
    router.push(ROLE_HOME[u.role]);
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-md px-4 py-12">
        <Card className="p-6 sm:p-8">
          <h1 className="text-xl font-bold">Log in to Fixora</h1>
          <p className="mt-1 text-sm text-[#64748B]">Mock authentication — no password needed for this prototype.</p>
          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <div><Label>Email</Label><Input {...register("email")} placeholder="joy@example.com" /><FieldError msg={errors.email?.message} /></div>
            {err && <p className="text-[13px] text-red-600">{err}</p>}
            <Button className="w-full" size="lg">Log In</Button>
          </form>
          <div className="mt-5 border-t border-[#E2E8F0] pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">One-click demo accounts</p>
            <div className="mt-2 grid gap-2">
              {(["customer", "provider", "admin"] as const).map((r) => (
                <Button key={r} variant="outline" className="w-full justify-start" onClick={() => { loginAs(r); router.push(ROLE_HOME[r]); }}>
                  Continue as {r} <span className="ml-auto text-xs text-[#64748B]">{r === "customer" ? "joy@example.com" : r === "provider" ? "rahim@fixora.demo" : "admin@fixora.demo"}</span>
                </Button>
              ))}
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-[#64748B]">New here? <Link href="/register" className="font-medium text-[#2563EB]">Create an account</Link> · <Link href="/forgot-password" className="font-medium text-[#2563EB]">Forgot password?</Link></p>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}

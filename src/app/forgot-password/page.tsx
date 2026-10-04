"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, FieldError } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";

export default function ForgotPassword() {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(z.object({ email: z.string().email() })), defaultValues: { email: "" },
  });
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-md px-4 py-12">
        <Card className="p-6 sm:p-8">
          <h1 className="text-xl font-bold">Reset password</h1>
          <p className="mt-1 text-sm text-[#64748B]">Demo only — we simulate sending a reset link.</p>
          <form onSubmit={handleSubmit(() => toast({ title: "Reset link sent (demo)", desc: "Check your inbox (simulated).", kind: "success" }))} className="mt-5 space-y-4">
            <div><Label>Email</Label><Input {...register("email")} placeholder="you@example.com" /><FieldError msg={errors.email?.message} /></div>
            <Button className="w-full" size="lg">Send Reset Link</Button>
          </form>
          <p className="mt-4 text-center text-sm"><Link href="/login" className="font-medium text-[#2563EB]">Back to login</Link></p>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}

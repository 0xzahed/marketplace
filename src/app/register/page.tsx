"use client";
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
import { useToast } from "@/components/ui/toaster";

const schema = z.object({
  name: z.string().min(3, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(11, "Enter a valid phone"),
});

export default function RegisterPage() {
  const router = useRouter();
  const { loginAs } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const onSubmit = handleSubmit(() => {
    toast({ title: "Account created (demo)", desc: "Logged in as customer.", kind: "success" });
    loginAs("customer");
    router.push("/customer/dashboard");
  });
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-md px-4 py-12">
        <Card className="p-6 sm:p-8">
          <h1 className="text-xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-[#64748B]">Demo registration — stored locally only.</p>
          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <div><Label>Full name</Label><Input {...register("name")} placeholder="Your name" /><FieldError msg={errors.name?.message} /></div>
            <div><Label>Email</Label><Input {...register("email")} placeholder="you@example.com" /><FieldError msg={errors.email?.message} /></div>
            <div><Label>Phone</Label><Input {...register("phone")} placeholder="+880 1XXX-XXXXXX" /><FieldError msg={errors.phone?.message} /></div>
            <Button className="w-full" size="lg">Get Started</Button>
          </form>
          <p className="mt-4 text-center text-sm text-[#64748B]">Already have an account? <Link href="/login" className="font-medium text-[#2563EB]">Log in</Link></p>
          <p className="mt-2 text-center text-sm"><Link href="/become-a-provider" className="font-medium text-[#2563EB]">Join as a provider →</Link></p>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}

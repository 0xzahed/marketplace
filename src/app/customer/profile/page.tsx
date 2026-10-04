"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerShell } from "@/app/customer/shell";
import { useAuth } from "@/features/auth/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError, Textarea } from "@/components/ui/input";
import { Avatar } from "@/components/ui/rating";
import { useToast } from "@/components/ui/toaster";

const schema = z.object({
  name: z.string().min(3, "Enter your name"),
  phone: z.string().min(11, "Enter a valid phone"),
  city: z.string().min(2),
  area: z.string().min(2),
});

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    values: { name: user?.name ?? "", phone: user?.phone ?? "", city: user?.city ?? "", area: user?.area ?? "" },
  });
  if (!user) return null;
  return (
    <CustomerShell title="My Profile" breadcrumb={["Customer", "Profile"]}>
      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <Card className="flex h-fit flex-col items-center p-6 text-center">
          <Avatar src={user.avatar} name={user.name} size={96} />
          <h3 className="mt-3 font-semibold">{user.name}</h3>
          <p className="text-[13px] text-[#64748B]">{user.email}</p>
          <p className="mt-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">{user.status}</p>
          <Input type="file" accept="image/*" className="mt-4" onChange={() => toast({ title: "Avatar updated (demo)", desc: "Preview only in this prototype.", kind: "info" })} />
        </Card>
        <Card className="p-6">
          <form onSubmit={handleSubmit((v) => { updateProfile(v); toast({ title: "Profile saved", desc: "Changes reflected across the app.", kind: "success" }); })} className="grid gap-4 sm:grid-cols-2">
            <div><Label>Full name</Label><Input {...register("name")} /><FieldError msg={errors.name?.message} /></div>
            <div><Label>Phone</Label><Input {...register("phone")} /><FieldError msg={errors.phone?.message} /></div>
            <div><Label>Email (display)</Label><Input value={user.email} disabled /></div>
            <div><Label>City</Label><Input {...register("city")} /><FieldError msg={errors.city?.message} /></div>
            <div className="sm:col-span-2"><Label>Area / Address</Label><Input {...register("area")} /><FieldError msg={errors.area?.message} /></div>
            <div className="sm:col-span-2"><Button>Save Changes</Button></div>
          </form>
        </Card>
      </div>
    </CustomerShell>
  );
}

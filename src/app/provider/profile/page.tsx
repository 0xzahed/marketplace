"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProviderShell, useMyProvider } from "@/app/provider/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError, Textarea } from "@/components/ui/input";
import { Avatar } from "@/components/ui/rating";
import { useToast } from "@/components/ui/toaster";

const schema = z.object({
  name: z.string().min(3), headline: z.string().min(5), about: z.string().min(20),
  location: z.string().min(2), workingHours: z.string().min(3),
});

export default function ProviderProfile() {
  const me = useMyProvider();
  const update = useApp((s) => s.updateProvider);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    values: { name: me?.name ?? "", headline: me?.headline ?? "", about: me?.about ?? "", location: me?.location ?? "", workingHours: me?.workingHours ?? "" },
  });
  if (!me) return null;
  return (
    <ProviderShell title="Profile" breadcrumb={["Provider", "Profile"]}>
      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <Card className="flex h-fit flex-col items-center p-6 text-center">
          <Avatar src={me.avatar} name={me.name} size={96} />
          <h3 className="mt-3 font-semibold">{me.name}</h3>
          <p className="text-[13px] text-[#64748B]">{me.profession}</p>
          <Input type="file" accept="image/*" className="mt-4" onChange={() => toast({ title: "Photo updated (demo preview)", kind: "info" })} />
        </Card>
        <Card className="p-6">
          <form onSubmit={handleSubmit((v) => { update(me.id, v); toast({ title: "Profile saved", kind: "success" }); })} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Full name</Label><Input {...register("name")} /><FieldError msg={errors.name?.message} /></div>
              <div><Label>Location</Label><Input {...register("location")} /><FieldError msg={errors.location?.message} /></div>
            </div>
            <div><Label>Headline</Label><Input {...register("headline")} /><FieldError msg={errors.headline?.message} /></div>
            <div><Label>About</Label><Textarea {...register("about")} /><FieldError msg={errors.about?.message} /></div>
            <div><Label>Working hours</Label><Input {...register("workingHours")} /></div>
            <div><Button>Save Profile</Button></div>
          </form>
        </Card>
      </div>
    </ProviderShell>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProviderShell, useMyProvider } from "@/app/provider/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError, Textarea, Select } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";
import { slugify, uid } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(5, "Min 5 characters"),
  categoryId: z.string().min(1, "Pick a category"),
  description: z.string().min(20, "Min 20 characters"),
  startingPrice: z.coerce.number().min(100, "Min ৳100"),
  pricingModel: z.enum(["fixed", "starting", "hourly", "quote"]),
  durationMin: z.coerce.number().min(0),
  location: z.string().min(2),
  mode: z.enum(["onsite", "remote", "either"]),
  included: z.string().min(3),
  cancellationPolicy: z.string().min(5),
});

export function ServiceForm({ initial, editId }: { initial?: Partial<z.infer<typeof schema>>; editId?: string }) {
  const me = useMyProvider();
  const categories = useApp((s) => s.categories);
  const services = useApp((s) => s.services);
  const addService = useApp((s) => s.addService);
  const updateService = useApp((s) => s.updateService);
  const router = useRouter();
  const { toast } = useToast();
  const existing = editId ? services.find((s) => s.id === editId) : null;
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: existing?.title ?? initial?.title ?? "",
      categoryId: existing?.categoryId ?? "",
      description: existing?.description ?? "",
      startingPrice: existing?.startingPrice ?? 1000,
      pricingModel: existing?.pricingModel ?? "starting",
      durationMin: existing?.durationMin ?? 60,
      location: existing?.location ?? me?.location ?? "Dhaka",
      mode: existing?.mode ?? "onsite",
      included: existing?.included.join(", ") ?? "",
      cancellationPolicy: existing?.cancellationPolicy ?? "Free cancellation up to 12 hours before.",
    },
  });

  const onSubmit = handleSubmit((v) => {
    if (editId && existing) {
      updateService(editId, {
        title: v.title, categoryId: v.categoryId, description: v.description,
        startingPrice: v.startingPrice, pricingModel: v.pricingModel, durationMin: v.durationMin,
        location: v.location, mode: v.mode,
        included: v.included.split(",").map((s) => s.trim()).filter(Boolean),
        cancellationPolicy: v.cancellationPolicy,
      });
      toast({ title: "Service updated", kind: "success" });
    } else {
      const title = v.title;
      // Runs on form submit (event handler), not during render.
      // eslint-disable-next-line react-hooks/purity
      const stamp = Date.now().toString(36);
      addService({
        id: uid("s"), slug: `${slugify(title)}-${stamp}`,
        title, categoryId: v.categoryId, providerId: me?.id ?? "p1",
        images: [`https://picsum.photos/seed/${uid("svc")}/800/500`],
        description: v.description,
        included: v.included.split(",").map((s) => s.trim()).filter(Boolean),
        excluded: ["Spare parts (quoted separately)"],
        process: ["Book & confirm", "Service visit", "Quality check & payment"],
        requirements: "Share details + photos in chat before visit.",
        cancellationPolicy: v.cancellationPolicy,
        startingPrice: v.startingPrice, pricingModel: v.pricingModel, durationMin: v.durationMin,
        rating: 5.0, reviewCount: 0, location: v.location, mode: v.mode,
        status: "Draft", verified: me?.verified ?? false,
        packages: [{ id: uid("pk"), name: "Standard", description: title, price: v.startingPrice, durationMin: v.durationMin }],
        addons: [], createdAt: new Date().toISOString(),
      });
      toast({ title: "Service created as Draft", desc: "Publish it from My Services.", kind: "success" });
    }
    router.push("/provider/services");
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div><Label>Title</Label><Input {...register("title")} placeholder="e.g. AC Master Servicing" /><FieldError msg={errors.title?.message} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Category</Label><Select {...register("categoryId")}><option value="">Select…</option>{categories.filter((c) => c.active).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select><FieldError msg={errors.categoryId?.message} /></div>
        <div><Label>Pricing model</Label><Select {...register("pricingModel")}><option value="fixed">Fixed price</option><option value="starting">Starting price</option><option value="hourly">Hourly rate</option><option value="quote">Custom quote</option></Select></div>
        <div><Label>Starting price (৳)</Label><Input type="number" {...register("startingPrice")} /><FieldError msg={errors.startingPrice?.message} /></div>
        <div><Label>Duration (minutes, 0 = flexible)</Label><Input type="number" {...register("durationMin")} /></div>
        <div><Label>Location</Label><Input {...register("location")} /><FieldError msg={errors.location?.message} /></div>
        <div><Label>Service mode</Label><Select {...register("mode")}><option value="onsite">On-site</option><option value="remote">Remote</option><option value="either">Either</option></Select></div>
      </div>
      <div><Label>Description</Label><Textarea {...register("description")} /><FieldError msg={errors.description?.message} /></div>
      <div><Label>Included (comma separated)</Label><Input {...register("included")} /><FieldError msg={errors.included?.message} /></div>
      <div><Label>Cancellation policy</Label><Input {...register("cancellationPolicy")} /></div>
      <div><Label>Cover images (demo preview)</Label><Input type="file" accept="image/*" multiple /></div>
      <div className="flex gap-2"><Button>{editId ? "Save Changes" : "Create Service"}</Button><Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button></div>
    </form>
  );
}

export default function NewServicePage() {
  return (
    <ProviderShell title="New Service" breadcrumb={["Provider", "Services", "New"]}>
      <Card className="p-5 sm:p-6"><ServiceForm /></Card>
    </ProviderShell>
  );
}

"use client";
import { ProviderShell, useMyProvider } from "@/app/provider/shell";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";

export default function VerificationPage() {
  const me = useMyProvider();
  const notify = useApp((s) => s.notify);
  const { toast } = useToast();
  return (
    <ProviderShell title="Verification" breadcrumb={["Provider", "Verification"]}>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Status: {me?.verificationStatus}</h3>
            {me?.verified && <VerifiedBadge />}
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2"><dt className="text-[#64748B]">NID card</dt><dd className="font-medium text-emerald-600">Submitted ✓</dd></div>
            <div className="flex justify-between border-b border-slate-100 pb-2"><dt className="text-[#64748B]">Profile photo</dt><dd className="font-medium text-emerald-600">Submitted ✓</dd></div>
            <div className="flex justify-between border-b border-slate-100 pb-2"><dt className="text-[#64748B]">Trade proof</dt><dd className={`font-medium ${me?.verificationStatus === "Needs Info" ? "text-amber-600" : "text-emerald-600"}`}>{me?.verificationStatus === "Needs Info" ? "Missing — action needed" : "Submitted ✓"}</dd></div>
          </dl>
          {me?.verificationStatus === "Needs Info" && (
            <p className="mt-3 rounded-[10px] bg-amber-50 p-3 text-[13px] text-amber-800">Admin feedback: please re-upload a clear trade license. Use Resubmit below.</p>
          )}
          {me?.verificationStatus === "Rejected" && (
            <p className="mt-3 rounded-[10px] bg-red-50 p-3 text-[13px] text-red-700">Your application was rejected. Fix the documents and resubmit.</p>
          )}
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => toast({ title: "Document preview (demo)", desc: "NID front — local placeholder, never uploaded.", kind: "info" })}>Preview Documents</Button>
            {(me?.verificationStatus === "Rejected" || me?.verificationStatus === "Needs Info") && (
              <Button onClick={() => {
                toast({ title: "Resubmitted for review (demo)", kind: "success" });
                notify({ userId: "u-admin-1", type: "verification", title: "Re-verification submitted", body: `${me?.name} resubmitted documents.`, link: "/admin/providers/verification" });
              }}>Resubmit</Button>
            )}
          </div>
        </Card>
        <Card className="p-5 text-sm text-[#334155]">
          <h3 className="font-semibold">How verification works</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Submit NID, photo and trade proof (local preview only).</li>
            <li>Status becomes <strong>Pending</strong>; admins review in Admin → Verification.</li>
            <li>Approved providers get the <strong>Verified</strong> badge everywhere.</li>
            <li>Approval does not auto-approve every service listing.</li>
          </ol>
        </Card>
      </div>
    </ProviderShell>
  );
}

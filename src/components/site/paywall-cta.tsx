import { Lock } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PaywallCta() {
  return (
    <div className="rounded-xl border bg-gradient-to-b from-muted/50 to-muted p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Lock className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">Premium Exclusive</h3>
      <p className="mb-6 text-sm text-muted-foreground">
        This job is locked for premium members. Unlock this job, get 48-hour early access to all future drives, and access exclusive referrals for just ₹299.
      </p>
      <Link
        href="/premium"
        className={cn(buttonVariants({ size: "lg", variant: "default" }), "w-full sm:w-auto")}
      >
        Unlock Premium Now
      </Link>
    </div>
  );
}

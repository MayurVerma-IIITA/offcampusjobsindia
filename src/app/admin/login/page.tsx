import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

const errorCopy: Record<string, string> = {
  invalid: "Enter a valid email and an 8+ character password.",
  credentials: "Email or password is incorrect.",
  database: "Database is not configured yet. Set DATABASE_URL and run migrations.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-4 py-10">
      <Card className="w-full">
        <CardHeader>
          <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LockKeyhole aria-hidden="true" />
          </div>
          <CardTitle>Editor login</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="mb-4 rounded-md border bg-muted p-3 text-sm text-muted-foreground">
              {errorCopy[error] || "Unable to sign in."}
            </p>
          ) : null}
          <form action={loginAction} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Email
              <Input type="email" name="email" autoComplete="email" required />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Password
              <Input
                type="password"
                name="password"
                autoComplete="current-password"
                required
              />
            </label>
            <Button type="submit">Sign in</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

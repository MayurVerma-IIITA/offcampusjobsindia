import { createEditorAction } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export default async function UsersPage() {
  const currentUser = await requireUser();
  const prisma = getPrisma();
  const users = prisma ? await prisma.user.findMany({ orderBy: { createdAt: "desc" } }) : [];

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[1fr_360px]">
      <section>
        <h1 className="text-4xl font-semibold">Editors</h1>
        <p className="mt-2 text-muted-foreground">Admin-created accounts only. Public registration is disabled.</p>
        <div className="mt-8 divide-y rounded-lg border bg-card">
          {users.map((user) => (
            <div key={user.id} className="grid gap-2 p-5 md:grid-cols-[1fr_120px]">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Badge>{user.role}</Badge>
            </div>
          ))}
          {!users.length ? (
            <p className="p-5 text-sm text-muted-foreground">Configure DATABASE_URL to list editor accounts.</p>
          ) : null}
        </div>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Create editor</CardTitle>
        </CardHeader>
        <CardContent>
          {currentUser.role !== "ADMIN" ? (
            <p className="text-sm text-muted-foreground">Only admins can create editor accounts.</p>
          ) : (
            <form action={createEditorAction} className="grid gap-4">
              <Input name="name" placeholder="Name" required />
              <Input type="email" name="email" placeholder="Email" required />
              <Input type="password" name="password" placeholder="Temporary password" required />
              <select name="role" className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="EDITOR">EDITOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <Button type="submit">Create account</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

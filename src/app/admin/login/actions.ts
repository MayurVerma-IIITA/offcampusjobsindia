"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, verifyEditorLogin } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/admin/login?error=invalid");
  }

  let session;

  try {
    session = await verifyEditorLogin(parsed.data.email, parsed.data.password);
  } catch {
    redirect("/admin/login?error=database");
  }

  if (!session) {
    redirect("/admin/login?error=credentials");
  }

  await createSession(session);
  redirect("/admin");
}

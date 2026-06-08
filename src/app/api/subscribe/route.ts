import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = schema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  const prisma = getPrisma();

  if (prisma) {
    await prisma.emailSubscriber.upsert({
      where: { email: parsed.data.email },
      update: {},
      create: { email: parsed.data.email, source: "homepage" },
    });
  }

  return NextResponse.redirect(new URL("/?subscribed=1", request.url), 303);
}

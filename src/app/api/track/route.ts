import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

const schema = z.object({
  type: z.string().min(1),
  path: z.string().optional(),
  jobId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid event payload." }, { status: 400 });
  }

  const prisma = getPrisma();

  if (prisma) {
    await prisma.analyticsEvent.create({
      data: {
        type: parsed.data.type,
        path: parsed.data.path,
        metadata: parsed.data.metadata as Prisma.InputJsonValue,
        ...(parsed.data.jobId
          ? { job: { connect: { id: parsed.data.jobId } } }
          : {}),
      },
    });
  }

  return NextResponse.json({ ok: true });
}

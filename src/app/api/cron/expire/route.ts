import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET(request: Request) {
  // Verify Vercel Cron secret
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return new NextResponse("Database not configured", { status: 500 });
  }

  try {
    const now = new Date();
    const result = await prisma.job.updateMany({
      where: {
        deadline: {
          lt: now,
        },
        status: {
          not: "EXPIRED",
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    return NextResponse.json({
      success: true,
      expiredCount: result.count,
    });
  } catch (error) {
    console.error("Cron expiry error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

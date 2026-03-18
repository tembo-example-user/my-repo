import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRecentActivity } from "@/lib/db/queries/activity";
import { activityQuerySchema } from "@/lib/validators/activity";
import { rateLimit } from "@/lib/rate-limit";
import { ApiError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days");
    const query = activityQuerySchema.parse({
      days: daysParam === null ? undefined : Number(daysParam),
      type: searchParams.get("type") ?? undefined,
    });

    const activity = await getRecentActivity(session.user.teamId, query);

    return NextResponse.json({ data: activity });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    console.error("[GET /api/activity]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

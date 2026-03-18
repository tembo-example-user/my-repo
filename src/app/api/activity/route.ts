import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRecentActivity } from "@/lib/db/queries/activity";
import { activityQuerySchema } from "@/lib/validators/activity";
import { rateLimit } from "@/lib/rate-limit";
import { handleApiError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded", statusCode: 429 },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", statusCode: 401 },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = activityQuerySchema.parse({
      days: Number(searchParams.get("days")) || 30,
      type: searchParams.get("type") || "all",
    });

    const activity = await getRecentActivity(session.user.teamId, query.days);

    return NextResponse.json({ data: activity });
  } catch (error) {
    return handleApiError(error, "GET /api/activity");
  }
}

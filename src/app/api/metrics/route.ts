import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTeamMetrics } from "@/lib/db/queries/metrics";
import { metricsQuerySchema } from "@/lib/validators/metrics";
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
    const query = metricsQuerySchema.parse({
      range: searchParams.get("range") || "30d",
      team: searchParams.get("team") || "all",
    });

    const metrics = await getTeamMetrics(session.user.teamId, query);

    return NextResponse.json({ data: metrics });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    console.error("[GET /api/metrics]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

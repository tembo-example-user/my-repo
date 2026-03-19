import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTeamMetrics } from "@/lib/db/queries/metrics";
import { metricsQuerySchema } from "@/lib/validators/metrics";
import { rateLimit } from "@/lib/rate-limit";
import { handleApiError, generateRequestId } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          status: "error" as const,
          message: "Rate limit exceeded", 
          code: "RATE_LIMIT_EXCEEDED",
          statusCode: 429, 
          requestId: generateRequestId() 
        },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { 
          status: "error" as const,
          message: "Unauthorized", 
          code: "UNAUTHORIZED",
          statusCode: 401, 
          requestId: generateRequestId() 
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = metricsQuerySchema.parse({
      range: searchParams.get("range") || "30d",
      team: searchParams.get("team") || "all",
    });

    const metrics = await getTeamMetrics(session.user.teamId, query);

    return NextResponse.json({ data: metrics });
  } catch (error) {
    return handleApiError(error, "GET /api/metrics");
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMetricById } from "@/lib/db/queries/metrics";
import { handleApiError, generateRequestId, NotFoundError } from "@/lib/errors";

interface RouteParams {
  params: { metricId: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
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

    const metric = await getMetricById(params.metricId, session.user.teamId);

    if (!metric) {
      throw new NotFoundError("Metric not found");
    }

    return NextResponse.json({ data: metric });
  } catch (error) {
    return handleApiError(error, `GET /api/metrics/${params.metricId}`);
  }
}

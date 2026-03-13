import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMetricById } from "@/lib/db/queries/metrics";
import { ApiError, NotFoundError } from "@/lib/errors";

interface RouteParams {
  params: { metricId: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const metric = await getMetricById(params.metricId, session.user.teamId);

    if (!metric) {
      throw new NotFoundError("Metric not found");
    }

    return NextResponse.json({ data: metric });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    console.error(`[GET /api/metrics/${params.metricId}]`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

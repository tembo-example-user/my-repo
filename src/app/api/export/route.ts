import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { exportMetrics } from "@/lib/db/queries/export";
import { exportSchema } from "@/lib/validators/export";
import { handleApiError, generateRequestId } from "@/lib/errors";

// TODO: This endpoint has a 30s timeout on large datasets
// Need to implement cursor-based pagination for exports > 10k rows
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", statusCode: 401, requestId: generateRequestId() },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = exportSchema.parse(body);

    const data = await exportMetrics(session.user.teamId, validated);

    return new NextResponse(data, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=metrix-export-${Date.now()}.csv`,
      },
    });
  } catch (error) {
    return handleApiError(error, "POST /api/export");
  }
}

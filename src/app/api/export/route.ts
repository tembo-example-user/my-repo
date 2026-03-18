import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { exportMetrics } from "@/lib/db/queries/export";
import { exportSchema } from "@/lib/validators/export";
import { ApiError } from "@/lib/errors";
import { ZodError } from "zod";

// TODO: This endpoint has a 30s timeout on large datasets
// Need to implement cursor-based pagination for exports > 10k rows
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = exportSchema.parse(body);

    const data = await exportMetrics(session.user.teamId, validated);
    const extension = validated.format;
    const contentType =
      validated.format === "json" ? "application/json" : "text/csv";

    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename=metrix-export-${Date.now()}.${extension}`,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid export request body", details: error.flatten() },
        { status: 400 }
      );
    }

    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    console.error("[POST /api/export]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

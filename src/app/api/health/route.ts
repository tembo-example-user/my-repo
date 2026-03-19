import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { handleApiError, generateRequestId } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded", statusCode: 429, requestId: generateRequestId() },
        { status: 429 }
      );
    }

    const timestamp = new Date().toISOString();
    
    return NextResponse.json({
      status: "ok",
      timestamp,
    });
  } catch (error) {
    return handleApiError(error, "GET /api/health");
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { exportMetrics } from "@/lib/db/queries/export";
import { exportSchema } from "@/lib/validators/export";
import { ApiError, ValidationError } from "@/lib/errors";

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
    const startDate = new Date(validated.startDate);
    const endDate = new Date(validated.endDate);
    if (startDate > endDate) {
      throw new ValidationError("startDate must be before or equal to endDate");
    }

    const rows = await exportMetrics(session.user.teamId, validated);
    const data = validated.includeUsers
      ? rows
      : rows.map(({ userName, userEmail, ...row }) => row);

    if (validated.format === "json") {
      return NextResponse.json({ data });
    }

    const escapeCsv = (value: string | number | null) => {
      if (value === null) return "";
      const stringValue = String(value);
      return /[",\n]/.test(stringValue)
        ? `"${stringValue.replace(/"/g, '""')}"`
        : stringValue;
    };

    const header = validated.includeUsers
      ? "Date,Type,Value,User,Email\n"
      : "Date,Type,Value\n";
    const csvRows = rows
      .map((row) =>
        validated.includeUsers
          ? [
              escapeCsv(row.date.toISOString()),
              escapeCsv(row.type),
              escapeCsv(row.value),
              escapeCsv(row.userName),
              escapeCsv(row.userEmail),
            ].join(",")
          : [
              escapeCsv(row.date.toISOString()),
              escapeCsv(row.type),
              escapeCsv(row.value),
            ].join(",")
      )
      .join("\n");
    const csv = header + csvRows;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=metrix-export-${Date.now()}.csv`,
      },
    });
  } catch (error) {
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

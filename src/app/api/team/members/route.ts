import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTeamMembers, addTeamMember } from "@/lib/db/queries/team";
import { addMemberSchema } from "@/lib/validators/team";
import { handleApiError, generateRequestId } from "@/lib/errors";

export async function GET(request: NextRequest) {
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

    const members = await getTeamMembers(session.user.teamId);

    return NextResponse.json({ data: members });
  } catch (error) {
    return handleApiError(error, "GET /api/team/members");
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const validated = addMemberSchema.parse(body);

    const member = await addTeamMember(session.user.teamId, validated);

    return NextResponse.json({ data: member }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "POST /api/team/members");
  }
}

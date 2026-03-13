import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { TeamMember, AddMemberInput } from "@/types/team.types";

export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  const members = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      avatarUrl: users.avatarUrl,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.teamId, teamId));

  // TODO: Join with metrics to get commit counts per user
  return members.map((m) => ({
    ...m,
    commits: 0,
  }));
}

export async function addTeamMember(
  teamId: string,
  input: AddMemberInput
): Promise<TeamMember> {
  const [member] = await db
    .insert(users)
    .values({
      ...input,
      teamId,
    })
    .returning();

  return { ...member, commits: 0 };
}

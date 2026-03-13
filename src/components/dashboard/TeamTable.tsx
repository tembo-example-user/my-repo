import { getTeamMembers } from "@/lib/db/queries/team";

interface TeamTableProps {
  teamId: string;
}

export async function TeamTable({ teamId }: TeamTableProps) {
  const members = await getTeamMembers(teamId);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900">Team</h3>
      <p className="text-sm text-gray-500 mt-1">Top contributors this month</p>
      <div className="mt-4 space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center">
                <span className="text-sm font-medium text-brand-700">
                  {member.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {member.name}
                </p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {member.commits}
              </p>
              <p className="text-xs text-gray-500">commits</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

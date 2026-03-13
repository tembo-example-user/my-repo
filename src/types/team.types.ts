export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  isActive: boolean;
  commits: number;
}

export interface AddMemberInput {
  email: string;
  name: string;
  role: "admin" | "member" | "viewer";
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

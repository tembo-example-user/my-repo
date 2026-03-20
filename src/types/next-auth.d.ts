import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      teamId: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    teamId?: string;
  }
}

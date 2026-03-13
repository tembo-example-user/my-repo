export interface ActivityDataPoint {
  date: string;
  commits: number;
  prs: number;
  user: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  resource: string;
  description: string | null;
  createdAt: Date;
  userName: string;
}

export type DateRange = "7d" | "30d" | "90d";

export interface MetricsQuery {
  range: DateRange;
  team: string;
}

export interface TeamMetrics {
  totalCommits: number;
  commitChange: number;
  prsMerged: number;
  prChange: number;
  avgReviewTime: number;
  reviewTimeChange: number;
  activeContributors: number;
  contributorChange: number;
}

export interface DetailedMetrics {
  summary: TeamMetrics;
  byUser: UserMetrics[];
  byType: TypeBreakdown[];
  trends: TrendPoint[];
}

export interface UserMetrics {
  userId: string;
  name: string;
  commits: number;
  prsMerged: number;
  reviewsCompleted: number;
  avgReviewTime: number;
}

export interface TypeBreakdown {
  type: string;
  count: number;
  percentage: number;
}

export interface TrendPoint {
  date: string;
  value: number;
}

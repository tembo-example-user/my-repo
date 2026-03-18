export interface ExportParams {
  startDate: string;
  endDate: string;
  format: "csv" | "json";
  includeUsers: boolean;
}

export interface ExportResult {
  data: string;
  rowCount: number;
  generatedAt: Date;
}

export interface ExportMetricRow {
  date: Date;
  type: string;
  value: number;
  userName: string | null;
  userEmail: string | null;
}

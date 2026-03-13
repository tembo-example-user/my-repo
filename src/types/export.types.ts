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

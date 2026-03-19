export interface ApiErrorResponse {
  status: "error";
  message: string;
  code: string;
  statusCode: number;
  requestId: string;
  details?: Array<{ path: string; message: string }>;
}

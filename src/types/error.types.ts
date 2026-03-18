export interface ApiErrorResponse {
  error: string;
  statusCode: number;
  requestId: string;
  details?: Array<{ path: string; message: string }>;
}

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import crypto from "crypto";
import type { ApiErrorResponse } from "@/types/error.types";

export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = "ApiError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = "Validation failed") {
    super(message, 422, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = "Rate limit exceeded") {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
    this.name = "RateLimitError";
  }
}

export function generateRequestId(): string {
  return crypto.randomUUID();
}

export function handleApiError(error: unknown, routeLabel: string): NextResponse<ApiErrorResponse> {
  const requestId = generateRequestId();

  if (error instanceof ApiError) {
    console.error(`[${routeLabel}] [${requestId}]`, error.message);
    return NextResponse.json(
      { 
        status: "error" as const,
        message: error.message, 
        code: error.code,
        statusCode: error.statusCode, 
        requestId 
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const details = error.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    console.error(`[${routeLabel}] [${requestId}] Validation error:`, details);
    return NextResponse.json(
      { 
        status: "error" as const,
        message: "Validation failed", 
        code: "VALIDATION_ERROR",
        statusCode: 422, 
        requestId, 
        details 
      },
      { status: 422 }
    );
  }

  if (
    error instanceof SyntaxError &&
    error.message.includes("JSON")
  ) {
    console.error(`[${routeLabel}] [${requestId}] Invalid JSON body`);
    return NextResponse.json(
      { 
        status: "error" as const,
        message: "Invalid JSON in request body", 
        code: "INVALID_JSON",
        statusCode: 400, 
        requestId 
      },
      { status: 400 }
    );
  }

  console.error(`[${routeLabel}] [${requestId}] Unhandled error:`, error);
  return NextResponse.json(
    { 
      status: "error" as const,
      message: "Internal server error", 
      code: "INTERNAL_ERROR",
      statusCode: 500, 
      requestId 
    },
    { status: 500 }
  );
}

import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = "Validation failed") {
    super(message, 422);
    this.name = "ValidationError";
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = "Rate limit exceeded") {
    super(message, 429);
    this.name = "RateLimitError";
  }
}

export function handleApiError(error: unknown, routeLabel: string): NextResponse {
  if (error instanceof ApiError) {
    console.error(`[${routeLabel}]`, error.message);
    return NextResponse.json(
      { error: error.message, statusCode: error.statusCode },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const details = error.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    console.error(`[${routeLabel}] Validation error:`, details);
    return NextResponse.json(
      { error: "Validation failed", statusCode: 422, details },
      { status: 422 }
    );
  }

  if (
    error instanceof SyntaxError &&
    error.message.includes("JSON")
  ) {
    console.error(`[${routeLabel}] Invalid JSON body`);
    return NextResponse.json(
      { error: "Invalid JSON in request body", statusCode: 400 },
      { status: 400 }
    );
  }

  console.error(`[${routeLabel}] Unhandled error:`, error);
  return NextResponse.json(
    { error: "Internal server error", statusCode: 500 },
    { status: 500 }
  );
}

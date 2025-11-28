import type { Context } from 'hono';

import type {
  ApiErrorResponse,
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '@/types/api-response';
import * as HttpStatusPhrases from '@/constants/http-status-phrases';
import * as HttpStatusCodes from '@/constants/http-status-codes';

/**
 * Creates a standardized success response
 *
 * @param c - Hono context
 * @param statusCode - HTTP status code
 * @param data - Response data
 * @param message - Optional custom message
 * @returns JSON response with standardized format
 *
 * @example
 * ```ts
 * return createSuccessResponse(c, 200, { id: 1, title: 'My Post' }, 'Post retrieved successfully');
 * ```
 */
export function createSuccessResponse<T>(
  c: Context,
  statusCode: number,
  data: T,
  message?: string
) {
  const statusPhrase = getStatusPhrase(statusCode);
  const response: ApiSuccessResponse<T> = {
    success: true,
    statusCode,
    message: message ?? statusPhrase,
    data,
    timestamp: new Date().toISOString(),
  };

  return c.json(response, statusCode as never);
}

/**
 * Creates a standardized error response
 *
 * @param c - Hono context
 * @param statusCode - HTTP status code
 * @param message - Error message
 * @param error - Error name/type
 * @param details - Optional additional error details
 * @param stack - Optional stack trace (only in development)
 * @returns JSON response with standardized error format
 *
 * @example
 * ```ts
 * return createErrorResponse(c, 404, 'Post not found', 'NotFoundError');
 * ```
 */
export function createErrorResponse(
  c: Context,
  statusCode: number,
  message: string,
  error?: string,
  details?: unknown,
  stack?: string
) {
  const statusPhrase = getStatusPhrase(statusCode);
  const response: ApiErrorResponse = {
    success: false,
    statusCode,
    message,
    error: error ?? statusPhrase,
    timestamp: new Date().toISOString(),
  };

  if (details !== undefined) {
    response.details = details;
  }

  if (stack !== undefined) {
    response.stack = stack;
  }

  return c.json(response, statusCode as never);
}

/**
 * Creates a standardized paginated response
 *
 * @param c - Hono context
 * @param statusCode - HTTP status code
 * @param data - Array of items
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @param message - Optional custom message
 * @returns JSON response with paginated format
 *
 * @example
 * ```ts
 * return createPaginatedResponse(c, 200, posts, 1, 10, 100, 'Posts retrieved successfully');
 * ```
 */
export function createPaginatedResponse<T>(
  c: Context,
  statusCode: number,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
) {
  const totalPages = Math.ceil(total / limit);
  const statusPhrase = getStatusPhrase(statusCode);

  const response: ApiPaginatedResponse<T> = {
    success: true,
    statusCode,
    message: message ?? statusPhrase,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    timestamp: new Date().toISOString(),
  };

  return c.json(response, statusCode as never);
}

/**
 * Helper function to get status phrase from status code
 */
function getStatusPhrase(statusCode: number): string {
  // Map common status codes to their phrases
  const statusMap: Record<number, string> = {
    [HttpStatusCodes.OK]: HttpStatusPhrases.OK,
    [HttpStatusCodes.CREATED]: HttpStatusPhrases.CREATED,
    [HttpStatusCodes.ACCEPTED]: HttpStatusPhrases.ACCEPTED,
    [HttpStatusCodes.NO_CONTENT]: HttpStatusPhrases.NO_CONTENT,
    [HttpStatusCodes.BAD_REQUEST]: HttpStatusPhrases.BAD_REQUEST,
    [HttpStatusCodes.UNAUTHORIZED]: HttpStatusPhrases.UNAUTHORIZED,
    [HttpStatusCodes.FORBIDDEN]: HttpStatusPhrases.FORBIDDEN,
    [HttpStatusCodes.NOT_FOUND]: HttpStatusPhrases.NOT_FOUND,
    [HttpStatusCodes.CONFLICT]: HttpStatusPhrases.CONFLICT,
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: HttpStatusPhrases.UNPROCESSABLE_ENTITY,
    [HttpStatusCodes.TOO_MANY_REQUESTS]: HttpStatusPhrases.TOO_MANY_REQUESTS,
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
    [HttpStatusCodes.BAD_GATEWAY]: HttpStatusPhrases.BAD_GATEWAY,
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: HttpStatusPhrases.SERVICE_UNAVAILABLE,
  };

  return statusMap[statusCode] ?? 'Unknown Status';
}

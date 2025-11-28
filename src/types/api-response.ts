/**
 * Standard API response structure for success responses
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Standard API response structure for error responses
 */
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error: string;
  details?: unknown;
  stack?: string;
  timestamp: string;
}

/**
 * Standard API response structure for paginated responses
 */
export interface ApiPaginatedResponse<T = unknown> {
  success: true;
  statusCode: number;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  timestamp: string;
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T = unknown> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse
  | ApiPaginatedResponse<T>;

/**
 * Pagination parameters for list endpoints
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

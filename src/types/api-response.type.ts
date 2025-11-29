export type ApiErrorResponse = {
  success: false;
  code: string;
  message: string;
  details?: unknown;
  stack?: string;
  timestamp?: string;
};

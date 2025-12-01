export type ApiSuccessResponse<T = void> = {
  success: true;
  message: string;
} & (T extends void ? object : { data: T });

export type ApiErrorResponse = {
  success: false;
  code: string;
  message: string;
  details?: unknown;
  stack?: string;
  timestamp?: string;
};

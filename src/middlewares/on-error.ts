import type { ErrorHandler } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

import { INTERNAL_SERVER_ERROR, OK } from '@/constants/http-status-codes';
import { env } from '@/config/env';
import { createErrorResponse } from '@/lib/api-response';

const onError: ErrorHandler = (err, c) => {
  const currentStatus = 'status' in err ? err.status : c.newResponse(null).status;
  const statusCode =
    currentStatus !== OK ? (currentStatus as ContentfulStatusCode) : INTERNAL_SERVER_ERROR;

  // Get error name or use default
  const errorName = err.name || 'Error';

  // Only include stack trace in development
  const stack = env.NODE_ENV === 'production' ? undefined : err.stack;

  return createErrorResponse(c, statusCode, err.message, errorName, undefined, stack);
};

export default onError;

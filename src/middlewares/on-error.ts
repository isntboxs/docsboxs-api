import { env } from '@/config/env';
import * as HttpStatusCodes from '@/constants/http-status-codes';
import { getStatusPhrases } from '@/utils/get-status-phrases';

import type { ErrorHandler } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { ApiErrorResponse } from '@/types/api-response.type';

const onError: ErrorHandler = (err, c) => {
  const currentStatus = 'status' in err ? err.status : c.newResponse(null).status;
  const statusCode =
    currentStatus !== HttpStatusCodes.OK
      ? (currentStatus as ContentfulStatusCode)
      : HttpStatusCodes.INTERNAL_SERVER_ERROR;

  return c.json<ApiErrorResponse>(
    {
      success: false,
      code: getStatusPhrases(statusCode),
      message: err.message,
      stack: env.NODE_ENV === 'production' ? undefined : err.stack,
      timestamp: new Date().toISOString(),
    },
    statusCode
  );
};

export default onError;

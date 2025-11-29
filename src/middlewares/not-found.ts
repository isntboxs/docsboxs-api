import * as HttpStatusCodes from '@/constants/http-status-codes';
import type { ApiErrorResponse } from '@/types/api-response.type';
import { getStatusPhrases } from '@/utils/get-status-phrases';

import type { NotFoundHandler } from 'hono';

const notFound: NotFoundHandler = (c) => {
  return c.json<ApiErrorResponse>(
    {
      success: false,
      code: getStatusPhrases(HttpStatusCodes.NOT_FOUND),
      message: `${getStatusPhrases(HttpStatusCodes.NOT_FOUND)} - ${c.req.path}`,
      timestamp: new Date().toISOString(),
    },
    HttpStatusCodes.NOT_FOUND
  );
};

export default notFound;

import pino from 'pino';
import pretty from 'pino-pretty';
import { format } from 'date-fns';

import { env } from '@/config/env';

export const logger = pino(
  {
    level: env.LOG_LEVEL,
    timestamp: () => `,"time":"${format(new Date(), 'HH:mm:ss')}"`,
  },
  pretty()
);

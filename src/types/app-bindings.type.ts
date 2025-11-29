import type { Env } from 'hono';

import type { PrismaClient } from '@/generated/prisma/client';

export interface AppBindings extends Env {
  Variables: {
    prisma: PrismaClient;
  };
}

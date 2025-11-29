import { createFactory } from 'hono/factory';

import { prisma } from '@/lib/prisma';

import type { AppBindings } from '@/types/app-bindings.type';

const factory = createFactory<AppBindings>({
  defaultAppOptions: {
    strict: false,
  },

  initApp: (app) => {
    app.use(async (c, next) => {
      c.set('prisma', prisma);
      await next();
    });
  },
});

export default factory;

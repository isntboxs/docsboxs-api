import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { requestId } from 'hono/request-id';

import { env } from '@/config/env';

import factory from '@/lib/factory';

import appLogger from '@/middlewares/app-logger';
import onError from '@/middlewares/on-error';
import notFound from '@/middlewares/not-found';
import serveEmojiFavicon from '@/middlewares/serve-emoji-favicon';

export default function createApp() {
  const app = factory.createApp();

  app.use(requestId());
  app.use(appLogger());
  app.use(prettyJSON());
  app.use(
    cors({
      origin: env.CORS_ORIGINS,
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['POST', 'GET', 'OPTIONS'],
      exposeHeaders: ['Content-Length'],
      maxAge: 600,
      credentials: true,
    })
  );
  app.use(serveEmojiFavicon('🐱'));

  app.notFound(notFound);
  app.onError(onError);
  return app;
}

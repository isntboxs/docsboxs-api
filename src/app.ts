import createApp from '@/lib/create-app';

import indexRoute from '@/routes/index.route';

const app = createApp();

app.get('/', (c) => {
  return c.redirect('/api');
});

app.basePath('/api').route('/', indexRoute);

export default app;

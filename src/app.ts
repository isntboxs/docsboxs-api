import createApp from '@/lib/create-app';

import authRoute from '@/routes/auth.route';
import indexRoute from '@/routes/index.route';

const app = createApp();

app.get('/', (c) => {
  return c.redirect('/api');
});

app.basePath('/api').route('/', indexRoute).route('/auth', authRoute);

export default app;

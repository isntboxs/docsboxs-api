import factory from '@/lib/factory';

const indexRoute = factory.createApp();

indexRoute.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Welcome to DocsBoxs API',
    version: '1.0.0',
    author: '@mrboxs',
    timestamp: new Date().toISOString(),
  });
});

export default indexRoute;

import createBlogHandler from '@/handlers/blog/create-blog.hander';
import factory from '@/lib/factory';

const blogsRoute = factory.createApp();

// Create blog (Protected)
blogsRoute.post('/', ...createBlogHandler);

export default blogsRoute;

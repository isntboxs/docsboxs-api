import { createSuccessResponse, createPaginatedResponse } from '@/lib/api-response';
import { OK, CREATED, NOT_FOUND } from '@/constants/http-status-codes';
import { HTTPException } from 'hono/http-exception';
import factory from '@/lib/factory';

/**
 * Example blog post type
 */
interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mock blog posts data
 */
const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Getting Started with Hono',
    content: 'Hono is a small, simple, and ultrafast web framework for the Edges...',
    author: 'John Doe',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Building REST APIs',
    content: 'REST APIs are a fundamental part of modern web development...',
    author: 'Jane Smith',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    title: 'TypeScript Best Practices',
    content: 'TypeScript adds static typing to JavaScript...',
    author: 'Bob Johnson',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

/**
 * Example blog routes demonstrating API response utilities
 */
const exampleBlogRoutes = factory.createApp();

// Get all posts (paginated)
exampleBlogRoutes.get('/posts', (c) => {
  const page = Number(c.req.query('page')) || 1;
  const limit = Number(c.req.query('limit')) || 10;

  const start = (page - 1) * limit;
  const paginatedPosts = mockPosts.slice(start, start + limit);

  return createPaginatedResponse(
    c,
    OK,
    paginatedPosts,
    page,
    limit,
    mockPosts.length,
    'Posts retrieved successfully'
  );
});

// Get single post
exampleBlogRoutes.get('/posts/:id', (c) => {
  const id = Number(c.req.param('id'));
  const post = mockPosts.find((p) => p.id === id);

  if (!post) {
    throw new HTTPException(NOT_FOUND, {
      message: `Post with ID ${id} not found`,
    });
  }

  return createSuccessResponse(c, OK, post, 'Post retrieved successfully');
});

// Create a new post
exampleBlogRoutes.post('/posts', async (c) => {
  const body = await c.req.json<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>();

  const newPost: BlogPost = {
    id: mockPosts.length + 1,
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockPosts.push(newPost);

  return createSuccessResponse(c, CREATED, newPost, 'Post created successfully');
});

// Update a post
exampleBlogRoutes.put('/posts/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const postIndex = mockPosts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    throw new HTTPException(NOT_FOUND, {
      message: `Post with ID ${id} not found`,
    });
  }

  const body = await c.req.json<Partial<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>>();

  const existingPost = mockPosts[postIndex]!; // Already validated it exists above
  const updatedPost: BlogPost = {
    id: existingPost.id,
    title: body.title ?? existingPost.title,
    content: body.content ?? existingPost.content,
    author: body.author ?? existingPost.author,
    createdAt: existingPost.createdAt,
    updatedAt: new Date().toISOString(),
  };

  mockPosts[postIndex] = updatedPost;

  return createSuccessResponse(c, OK, updatedPost, 'Post updated successfully');
});

// Delete a post
exampleBlogRoutes.delete('/posts/:id', (c) => {
  const id = Number(c.req.param('id'));
  const postIndex = mockPosts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    throw new HTTPException(NOT_FOUND, {
      message: `Post with ID ${id} not found`,
    });
  }

  const deletedPost = mockPosts.splice(postIndex, 1)[0];

  return createSuccessResponse(c, OK, deletedPost, 'Post deleted successfully');
});

export default exampleBlogRoutes;

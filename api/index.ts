import { handle } from '@hono/node-server/vercel';
import app from '../dist/src/app';

export default handle(app);

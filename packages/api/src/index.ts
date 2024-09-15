import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { initializeDatabase } from './db/client';
import { userRoutes } from './routes/users';

const app = new Elysia()
  .use(cors())
  .get('/', () => 'Hello, Elysia!')
  .use(userRoutes)


// Initialize the database before starting the server
await initializeDatabase();

app.listen(3001);
console.log(`API server is running at ${app.server?.hostname}:${app.server?.port}`);


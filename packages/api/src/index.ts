import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { initializeDatabase } from './db/client';
import { userRoutes } from './routes/users';
import { testRoutes } from './routes/test';

const app = new Elysia()
  .use(cors())
  .get('/', () => 'Hello, Elysia!')
  .use(userRoutes)
  .use(testRoutes);

// Initialize the database before starting the server
await initializeDatabase();

app.listen(3001);
console.log(`API server is running at ${app.server?.hostname}:${app.server?.port}`);

app.get('/api/users/:userId', ({ params }) => {
  const userId = parseInt(params.userId, 10);
  const user = users.find(u => u.id === userId);
  
  if (user) {
    return user;
  } else {
    throw new Error('User not found');
  }
});

// Make sure to define the 'users' array somewhere in your code
const users: User[] = []; // This should be populated with actual user data

export interface User {
  id: number;
  name: string;
  email: string;
}
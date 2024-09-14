import { Elysia } from 'elysia';
import { db } from '../db/client';
import { users } from '../models/users';

export const testRoutes = new Elysia({ prefix: '/api/v1' })
  .get('/test', () => {
    return { status: 200, body: { message: 'API is working' } };
  })
  .get('/db-test', async () => {
    try {
      const result = await db.execute('SELECT 1');
      return { status: 200, body: { message: 'Database connected successfully', result } };
    } catch (error) {
      console.error('Database connection test failed:', error);
      return { status: 500, body: { message: 'Database connection test failed', error: String(error) } };
    }
  })
  .get('/add-test-user', async () => {
    try {
      const user = await db.insert(users).values({ name: 'Test User', email: 'test@example.com' }).returning().get();
      return { status: 201, body: user };
    } catch (error) {
      console.error('Error adding test user:', error);
      return { status: 500, body: { message: 'Failed to add test user', error: String(error) } };
    }
  });
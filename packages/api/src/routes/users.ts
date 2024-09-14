import { Elysia } from 'elysia';
import { db } from '../db/client';
import { users } from '../models/users';
import { createUserSchema } from '../schemas/users';
import { eq } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';

export const userRoutes = new Elysia({ prefix: '/api/v1' })
  .post('/users', async ({ body }) => {
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
        return { status: 400, body: parsed.error.errors };
    }
    const { name, email } = parsed.data;
    try {
        const user = await db.insert(users)
            .values({ name, email })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                created_at: users.created_at,
            })
            .get();
        return { status: 201, body: user };
    } catch (error) {
        console.error('Error creating user:', error);
        return { status: 500, body: { message: 'Failed to create user', error: String(error) } };
    }
  })
  .get('/users', async ({ query }) => {
    const page = parseInt(query.page as string || '1');
    const limit = parseInt(query.limit as string || '10');
    const offset = (page - 1) * limit;
    
    const [usersList, totalCount] = await Promise.all([
        db.select().from(users).limit(limit).offset(offset),
        db.select({ count: sql`count(*)` }).from(users).get().then(result => result?.count ?? 0)
    ]);
    
    return { 
        status: 200, 
        body: {
            users: usersList,
            total: totalCount,
            page,
            limit
        }
    };
  })
  .get('/users/:id', async ({ params }) => {
    const user = await db.select().from(users).where(eq(users.id, Number(params.id))).get();
    if (!user) {
        return { status: 404, body: { message: 'User not found' } };
    }
    return { status: 200, body: user };
  })
  .delete('/users/:id', async ({ params }) => {
    const result = await db.delete(users).where(eq(users.id, Number(params.id)));
    if (result.rowsAffected === 0) {
        return { status: 404, body: { message: 'User not found' } };
    }
    return { status: 204 };
  });
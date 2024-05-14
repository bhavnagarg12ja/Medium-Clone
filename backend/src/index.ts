import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'

//create the main hono app
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>();

//sign up route
app.post('/api/v1/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password
      }
    })
    //@ts-ignore
    const token = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({
      jwt : token,
    });
  } catch (e) {
    c.status(403);
    return c.json({ error: "error while signing up" });
  }
})

//SIGNIN ROUTE
app.post('/api/v1/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = c.req.json();
  const user = await prisma.user.findUnique({
    where: {
      email: body.email
    }
  });
  if (!user) {
    c.status(403);
    return c.json({ error: "user not found" });
  }
  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ jwt });
})

app.get('/api/v1/blog:id', (c) => {
  //@ts-ignore
  const id = c.req.param('id');
  console.log(id);
  return c.text('get blog route Hono!')
})

app.post('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/blog/bulk', (c) => {
  return c.text('Hello Hono!')
})

export default app
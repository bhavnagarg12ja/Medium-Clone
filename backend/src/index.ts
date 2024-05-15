import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
// import { signinInput, signupInput } from "@harnoor_singh/medium-common";

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

  try {
    const body = await c.req.json();
    // const { success } = signupInput.safeParse(body);
    // if (!success) {
    //   console.log(success);
    //   c.status(411);
    //   return c.json({ error: "Inputs not correct" });
    // }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password
      }
    })
    console.log(user);

    const token = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({
      jwt : token,
    });
  } catch (e) {
    console.log(e);
    c.status(403);
    return c.json({ error: "error while signing up" });
  }
})

//SIGNIN ROUTE
app.post('/api/v1/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  // const { success } = signinInput.safeParse(body);
  // if( !success) {
  //   console.log(success);
  //   c.status(411);
  //   return c.json({ error: "Inputs not correct" });
  // }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password
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
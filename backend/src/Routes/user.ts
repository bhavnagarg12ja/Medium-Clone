import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signinInput, signupInput } from '@bhavnagarg12ja/medium-common'

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

//SIGNUP ROUTE
userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try {
      const body = await c.req.json();
      const { success } = signupInput.safeParse(body);
      if (!success) {
        console.log(success);
        c.status(411);
        return c.json({ error: "Inputs not correct" });
      }
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
  userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if( !success) {
      console.log(success);
      c.status(411);
      return c.json({ error: "Inputs not correct" });
    }
  
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
  });

  export default userRouter;
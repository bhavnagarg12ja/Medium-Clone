import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    };
    Variables: {
        userId: string
    }
}>();

// Middlewares
blogRouter.use("/*", async (c, next) => {
    // Bearer Token
    const header = c.req.header("authorization") || "";
    const token = header.split(" ")[1];

    try {
        const response = await verify(token, c.env.JWT_SECRET);
        if (response) {
            c.set("userId", response.id);
            await next();
        } else {
            c.status(403);
            return c.json({
                error: "You are not logged in",
            });
        }
    } catch (e) {
        c.status(403);
        return c.json({
            error: "unauthorized",
        });
    }
});
+

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const authorId = c.get("userId");
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: authorId,
            },
        });

        return c.json({
            blog: blog.id,
        });
    } catch (e) {
        console.log(e);
    }
})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const blog = await prisma.post.update({
            where: {
                id: body.id
            },
            data: {
                title: body.title,
                content: body.content
            },
        });

        return c.json({
            blog: blog.id,
        });
    } catch (e) {
        console.log(e);
    }
})

blogRouter.get('/bulk', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogs = await prisma.post.findMany({
        where: {
            NOT: {
                authorId:c.get("userId"),
            },
            author: {
                name: {
                  not: null,
                },
            },
        },
        select: {
            title: true,
            id: true,
            content: true,
            author: {
                select: {
                    name: true,
                },
            },
        },
    });
    return c.json({
        blogs
    })
})

blogRouter.get("/:id", async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try {
      const blog = await prisma.post.findFirst({
        where: {
          id: id,
        },
        select: {
          id: true,
          title: true,
          content: true,
          author: {
            select: {
              name: true,
            },
          },
        },
      });
  
      return c.json({
        blog,
      });
    } catch (e) {
      c.status(411); // 4
      return c.json({
        message: "Error while fetching blog post",
      });
    }
  });
  
  blogRouter.delete("/delete/:id", async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try {
      const deleteBlog = await prisma.post.delete({
        where: {
          id: id,
        },
      });
  
      console.log(deleteBlog);
      c.status(200);
      return c.json({
        message: "Blog deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return c.json({
        message: "Error while deleting blog post",
      });
    }
  });
  
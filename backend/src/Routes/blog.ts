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
                error: "unauthorized",
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

blogRouter.get('/', async (c) => {
    const body = await c.req.json();
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const blog = await prisma.post.findFirst({
            where: {
                id: body.id
            }
        });

        return c.json({
            blog
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
            }
        }
    });
    return c.json({
        blogs
    })

    return c.text('Hello Hono!')
})
import { Hono } from 'hono'
import { userRouter } from './Routes/user';
import { blogRouter } from './Routes/blog';
import { cors } from "hono/cors";

//create the main hono app
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>();

app.use("/api/*", cors());

// Defining routes
app.route("/api/vi/user", userRouter);
app.route("api/v1/blog" , blogRouter);

export default app
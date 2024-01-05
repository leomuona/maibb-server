import { join } from "path";
import autoload from "@fastify/autoload";
import dotenv from "dotenv";
import fastify from "fastify";

dotenv.config();

const app = fastify({ logger: true });

app.register(autoload, {
  dir: join(__dirname, "routes"),
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await app.listen({ port });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

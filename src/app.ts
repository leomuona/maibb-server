import autoLoad from "@fastify/autoload";
import fastify from "fastify";
import { join } from "path";

const app = fastify({ logger: true });

app.register(autoLoad, {
  dir: join(__dirname, "routes"),
});

const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

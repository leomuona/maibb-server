import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import mysql from "mysql2/promise";
import { env } from "../../config/env";

type Database = {
  foo: () => void;
};

declare module "fastify" {
  interface FastifyInstance {
    db: Database;
  }
}

const foo = () => {
  // TODO foo
};

const dbPlugin: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  const connection = await mysql.createConnection({
    database: env.DB_NAME,
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
  });

  fastify.decorate("db", {
    foo,
  });

  fastify.addHook("onClose", async () => connection.end());
};

export default fp(dbPlugin);

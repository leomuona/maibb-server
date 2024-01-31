import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import mysql from "mysql2/promise";
import { env } from "../../config/env";
import {
  NewUserData,
  UserData,
  getUser,
  getUserByUsername,
  insertUser,
} from "./users";

type Database = {
  users: {
    create: (user: NewUserData) => Promise<UserData>;
    get: (id: string) => Promise<UserData | null>;
    getByUsername: (username: string) => Promise<UserData | null>;
  };
};

declare module "fastify" {
  interface FastifyInstance {
    db: Database;
  }
}

const dbPlugin: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  const pool = mysql.createPool({
    database: env.DB_NAME,
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
  });

  fastify.decorate("db", {
    users: {
      create: async (user: NewUserData) => await insertUser(user, pool),
      get: async (id: string) => await getUser(id, pool),
      getByUsername: async (username: string) =>
        await getUserByUsername(username, pool),
    },
  });

  fastify.addHook("onClose", async () => pool.end());
};

export default fp(dbPlugin);

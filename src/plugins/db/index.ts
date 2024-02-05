import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { database } from "./database";
import { NewUser, User } from "./types";
import { createUser, getUser, getUserByUsername } from "./users";

type DbDecorator = {
  users: {
    create: (user: NewUser) => Promise<string>;
    get: (id: string) => Promise<User | undefined>;
    getByUsername: (username: string) => Promise<User | undefined>;
  };
};

declare module "fastify" {
  interface FastifyInstance {
    db: DbDecorator;
  }
}

const dbPlugin: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.decorate("db", {
    users: {
      create: async (user: NewUser) => await createUser(user),
      get: async (id: string) => await getUser(id),
      getByUsername: async (username: string) =>
        await getUserByUsername(username),
    },
  });

  fastify.addHook("onClose", async () => await database.destroy());
};

export default fp(dbPlugin);

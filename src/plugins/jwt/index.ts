import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

type JWT = {
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
};

declare module "fastify" {
  interface FastifyInstance {
    jwt: JWT;
  }
}

const generateAccessToken = (): string => {
  return "todo";
};

const generateRefreshToken = (): string => {
  return "todo";
};

const jwtPlugin: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.decorate("jwt", {
    generateAccessToken,
    generateRefreshToken,
  });
};

export default fp(jwtPlugin);

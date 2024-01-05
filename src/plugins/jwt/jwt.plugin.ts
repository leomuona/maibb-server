import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import JwtService from "./jwt.service";

declare module "fastify" {
  interface FastifyInstance {
    jwt: JwtService;
  }
}

const jwtPlugin: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.decorate("jwt", new JwtService());
};

export default fp(jwtPlugin);

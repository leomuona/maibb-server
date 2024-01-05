import { FastifyPluginAsync } from "fastify";

const authPlugin: FastifyPluginAsync = async (
  fastify,
  _opts,
): Promise<void> => {
  const token = fastify.jwt.generateAccessToken();
  fastify.get("/", async (_request, _reply) => ({ token }));
};

export default authPlugin;

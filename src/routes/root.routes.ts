import { FastifyPluginAsync } from "fastify";

const rootRoutes: FastifyPluginAsync = async (
  fastify,
  _opts,
): Promise<void> => {
  fastify.get("/", async (_request, _reply) => ({ root: true }));
};

export default rootRoutes;

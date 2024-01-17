import { FastifyPluginAsync } from "fastify";
import {
  getAuthenticatedUser,
  login,
  logout,
  refresh,
} from "../controllers/auth.controller";
import {
  LoginPropsType,
  getAuthenticatedUserSchema,
  loginSchema,
  refreshSchema,
} from "../schema/auth.schema";

const authRoutes: FastifyPluginAsync = async (
  fastify,
  _opts,
): Promise<void> => {
  fastify.post<{ Body: LoginPropsType }>(
    "/login",
    { schema: loginSchema },
    login,
  );

  fastify.get("/refresh", { schema: refreshSchema }, refresh);

  fastify.get(
    "/authenticateduser",
    { schema: getAuthenticatedUserSchema },
    getAuthenticatedUser,
  );

  fastify.get("/logout", logout);
};

export default authRoutes;

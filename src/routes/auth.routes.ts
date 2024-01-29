import { FastifyPluginAsync } from "fastify";
import {
  getAuthenticatedUser,
  login,
  logout,
} from "../controllers/auth.controller";
import {
  LoginPropsType,
  getAuthenticatedUserSchema,
  loginSchema,
  logoutSchema,
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

  fastify.get(
    "/authenticateduser",
    {
      schema: getAuthenticatedUserSchema,
      onRequest: [fastify.jwt.authorize],
    },
    getAuthenticatedUser,
  );

  fastify.get("/logout", { schema: logoutSchema }, logout);
};

export default authRoutes;

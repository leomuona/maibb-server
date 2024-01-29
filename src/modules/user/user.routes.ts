import { FastifyPluginAsync } from "fastify";
import { getAuthenticatedUser, login, logout } from "./user.controller";
import {
  LoginPropsType,
  getAuthenticatedUserSchema,
  loginSchema,
  logoutSchema,
} from "./user.schema";

const userRoutes: FastifyPluginAsync = async (
  fastify,
  _opts,
): Promise<void> => {
  fastify.post<{ Body: LoginPropsType }>(
    "/login",
    { schema: loginSchema },
    login,
  );

  fastify.get("/logout", { schema: logoutSchema }, logout);

  fastify.get(
    "/authenticated",
    {
      schema: getAuthenticatedUserSchema,
    },
    getAuthenticatedUser,
  );
};

export default userRoutes;

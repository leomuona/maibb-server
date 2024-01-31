import { FastifyPluginAsync } from "fastify";
import {
  getAuthenticatedUser,
  login,
  logout,
  registerUser,
} from "./user.controller";
import {
  LoginPropsType,
  getAuthenticatedUserSchema,
  loginSchema,
  logoutSchema,
  registerUserSchema,
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

  fastify.post("/register", { schema: registerUserSchema }, registerUser);
};

export default userRoutes;

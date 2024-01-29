import { FastifyReply, FastifyRequest } from "fastify";
import { LoginPropsType } from "../schema/auth.schema";
import { getUser, loginUser } from "../services/user.service";

export const login = async (
  request: FastifyRequest<{ Body: LoginPropsType }>,
  reply: FastifyReply,
) => {
  try {
    const user = loginUser(request.body.username, request.body.password);
    const token = request.server.jwt.create(user.id);

    return { token };
  } catch (_err) {
    return reply.code(400).send("login or password incorrect");
  }
};

export const getAuthenticatedUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (!request.userId) {
    return reply.code(401).send("Unauthorized");
  }

  const user = getUser(request.userId);
  if (!user) {
    return reply.code(500).send("Unable to find user");
  }

  return user;
};

export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    request.server.jwt.invalidate(request);

    return reply.code(200).send();
  } catch (_err) {
    return reply.code(401).send("Unauthorized");
  }
};

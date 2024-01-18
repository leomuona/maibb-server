import { FastifyReply, FastifyRequest } from "fastify";
import { LoginPropsType } from "../schema/auth.schema";
import { getUser, loginUser } from "../services/user.service";

const getAuthToken = (request: FastifyRequest): string => {
  const header = request.headers.authorization;
  if (!header) {
    throw new Error("Bearer authorization required");
  }

  const split = header.split(" ");
  if (split[0] !== "Bearer") {
    throw new Error("Bearer authorization required");
  }

  const token = split[1];
  if (!token) {
    throw new Error("Bearer authorization required");
  }

  return token;
};

const authorize = (request: FastifyRequest): string => {
  const token = getAuthToken(request);
  const userId = request.server.jwt.validate(token);

  return userId;
};

export const login = async (
  request: FastifyRequest<{ Body: LoginPropsType }>,
  reply: FastifyReply,
) => {
  try {
    const user = loginUser(request.body.login, request.body.password);
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
  try {
    const userId = authorize(request);
    const user = getUser(userId);
    if (!user) {
      return reply.code(500).send("Unable to find user");
    }
    return user;
  } catch (_err) {
    return reply.code(401).send("Unauthorized");
  }
};

export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = getAuthToken(request);
    request.server.jwt.invalidate(token);

    return reply.code(200).send();
  } catch (_err) {
    return reply.code(401).send("Unauthorized");
  }
};

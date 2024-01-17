import { FastifyReply, FastifyRequest } from "fastify";
import { LoginPropsType } from "../schema/auth.schema";
import { getUser, loginUser } from "../services/user.service";
import {
  buildRefreshTokenCookie,
  getRefreshTokenFromCookie,
} from "../utils/cookie";

export const authorize = async (request: FastifyRequest): Promise<string> => {
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

  return request.server.jwt.validate(token);
};

export const login = async (
  request: FastifyRequest<{ Body: LoginPropsType }>,
  reply: FastifyReply,
) => {
  try {
    const user = loginUser(request.body.login, request.body.password);
    const token = request.server.jwt.createAccessToken(user.id);
    const refreshToken = request.server.jwt.createRefreshToken(user.id);

    reply.header("set-cookie", buildRefreshTokenCookie(refreshToken));
    return { token };
  } catch (_err) {
    return reply.code(400).send("login or password incorrect");
  }
};

export const refresh = async (request: FastifyRequest, reply: FastifyReply) => {
  const refreshToken = getRefreshTokenFromCookie(request.headers.cookie);
  if (!refreshToken) {
    return reply.code(400).send("Request has no refresh token");
  }

  try {
    const userId = request.server.jwt.validateRefreshToken(refreshToken);
    const token = request.server.jwt.createAccessToken(userId);
    return { token };
  } catch (_err) {
    return reply.code(401).send("Invalid refresh token");
  }
};

export const getAuthenticatedUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userId = await authorize(request);
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
    const userId = await authorize(request);
    request.server.jwt.clearRefreshTokens(userId);

    return reply.code(200).send();
  } catch (_err) {
    return reply.code(401).send("Unauthorized");
  }
};

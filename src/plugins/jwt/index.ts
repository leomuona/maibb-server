import { randomUUID } from "crypto";
import { addSeconds } from "date-fns";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import {
  addRefreshToken,
  checkRefreshToken,
  removeRefreshTokens,
} from "./tokens";

type JWT = {
  createAccessToken: (userId: string) => string;
  createRefreshToken: (userId: string) => string;
  validate: (token: string) => string;
  validateRefreshToken: (token: string) => string;
  clearRefreshTokens: (userId: string) => void;
};

declare module "fastify" {
  interface FastifyInstance {
    jwt: JWT;
  }
}

const createAccessToken = (userId: string): string => {
  const claims = {};
  const options = {
    issuer: env.JWT_ISSUER,
    subject: userId,
    expiresIn: env.JWT_TOKEN_VALIDITY * 1000, // ms
    algrithm: "HS256",
  };
  const token = jwt.sign(claims, env.JWT_SECRET, options);
  return token;
};

const createRefreshToken = (userId: string): string => {
  const jwtid = randomUUID();
  const claims = {};
  const options = {
    jwtid,
    issuer: env.JWT_ISSUER,
    subject: userId,
    expiresIn: env.JWT_REFRESH_TOKEN_VALIDITY * 1000, // ms
    algrithm: "HS256",
  };
  const token = jwt.sign(claims, env.JWT_SECRET, options);

  addRefreshToken(
    jwtid,
    userId,
    addSeconds(new Date(), env.JWT_REFRESH_TOKEN_VALIDITY),
  );
  return token;
};

const validate = (token: string): string => {
  const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });
  if (decoded.sub && typeof decoded.sub === "string") {
    return decoded.sub; // subject is userId
  }
  throw new Error("JWT token is missing subject");
};

const validateRefreshToken = (token: string): string => {
  const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });
  if (typeof decoded === "string") {
    throw new Error("Problem decoding JWT token");
  }

  if (!(decoded.jti && checkRefreshToken(decoded.jti))) {
    throw new Error("Refresh token is missing jti");
  }

  if (decoded.sub && typeof decoded.sub === "string") {
    return decoded.sub; // subject is userId
  }
  throw new Error("JWT token is missing subject");
};

const clearRefreshTokens = (userId: string) => {
  removeRefreshTokens(userId);
};

const jwtPlugin: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.decorate("jwt", {
    createAccessToken,
    createRefreshToken,
    validate,
    validateRefreshToken,
    clearRefreshTokens,
  });
};

export default fp(jwtPlugin);

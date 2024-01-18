import { randomUUID } from "crypto";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { invalidateToken, isTokenInvalidated } from "./invalidTokens";

type JWT = {
  create: (userId: string) => string;
  validate: (token: string) => string;
  invalidate: (token: string) => void;
};

declare module "fastify" {
  interface FastifyInstance {
    jwt: JWT;
  }
}

const create = (userId: string): string => {
  const jwtid = randomUUID();
  const claims = {};
  const options = {
    jwtid,
    issuer: env.JWT_ISSUER,
    subject: userId,
    expiresIn: env.JWT_TOKEN_VALIDITY * 1000, // ms
    algorithm: "HS256" as const,
  };
  const token = jwt.sign(claims, env.JWT_SECRET, options);
  return token;
};

const validate = (token: string): string => {
  const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });
  if (typeof decoded === "string") {
    throw new Error("Invalid JWT token structure");
  }

  if (!decoded.jti || isTokenInvalidated(decoded.jti)) {
    throw new Error("JWT token has been invalidated");
  }

  if (decoded.sub) {
    return decoded.sub; // subject is userId
  }
  throw new Error("JWT token is missing subject");
};

const invalidate = (token: string) => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    if (typeof decoded === "string") {
      // Invalid JWT token structure
      return;
    }

    if (decoded.jti && decoded.exp) {
      invalidateToken(decoded.jti, decoded.exp);
    }
  } catch (_err) {
    // nothing
  }
};

const jwtPlugin: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.decorate("jwt", {
    create,
    validate,
    invalidate,
  });
};

export default fp(jwtPlugin);

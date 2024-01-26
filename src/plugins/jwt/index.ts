import { randomUUID } from "crypto";
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import jsonwebtoken from "jsonwebtoken";
import { env } from "../../config/env";
import { invalidateToken, isTokenInvalidated } from "./invalidTokens";

type JWT = {
  create: (userId: string) => string;
  authorize: (
    request: FastifyRequest,
    reply: FastifyReply,
    done: () => void,
  ) => void;
  invalidate: (request: FastifyRequest) => void;
};

declare module "fastify" {
  interface FastifyInstance {
    jwt: JWT;
  }

  interface FastifyRequest {
    userId: string;
  }
}

const getToken = (request: FastifyRequest): string => {
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
  const token = jsonwebtoken.sign(claims, env.JWT_SECRET, options);
  return token;
};

const validate = (token: string): string => {
  const decoded = jsonwebtoken.verify(token, env.JWT_SECRET, {
    algorithms: ["HS256"],
  });
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

const invalidate = (request: FastifyRequest) => {
  const token = getToken(request);
  const decoded = jsonwebtoken.verify(token, env.JWT_SECRET, {
    algorithms: ["HS256"],
  });
  if (typeof decoded === "string") {
    throw new Error("Invalid JWT token structure");
  }

  if (decoded.jti && decoded.exp) {
    invalidateToken(decoded.jti, decoded.exp);
  }
};

// Add this to route's onRequest: [fastify.jwt.authorize]
const authorize = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void,
) => {
  try {
    const token = getToken(request);
    const userId = validate(token);
    request.userId = userId;
  } catch (_err) {
    reply.code(401).send("Unauthorized");
  }
  done();
};

const jwtPlugin: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.decorate("jwt", {
    create,
    authorize,
    invalidate,
  });
};

export default fp(jwtPlugin);

import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const EnvSchema = Type.Object({
  JWT_ISSUER: Type.String(),
  JWT_SECRET: Type.String(),
  JWT_TOKEN_VALIDITY: Type.Integer({ default: 900 }), // 15 mins
  JWT_REFRESH_TOKEN_VALIDITY: Type.Integer({ default: 86400 }), // 24 hours
  JWT_REFRESH_COOKIE_NAME: Type.String(),
  NODE_ENV: Type.String(),
  PORT: Type.Integer({ default: 3000 }),
});

export const env = Value.Cast(EnvSchema, process.env);

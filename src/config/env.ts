import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const EnvSchema = Type.Object({
  JWT_ISSUER: Type.String(),
  JWT_SECRET: Type.String(),
  JWT_TOKEN_VALIDITY: Type.Integer({ default: 86400 }), // 24 hours
  NODE_ENV: Type.String(),
  PORT: Type.Integer({ default: 3000 }),
  DB_NAME: Type.String(),
  DB_HOST: Type.String(),
  DB_PORT: Type.Integer({ default: 3306 }),
  DB_USERNAME: Type.String(),
  DB_PASSWORD: Type.String(),
});

export const env = Value.Cast(EnvSchema, process.env);

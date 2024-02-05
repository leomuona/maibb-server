import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { env } from "../../config/env";
import { Database } from "./types";

const dialect = new MysqlDialect({
  pool: createPool({
    database: env.DB_NAME,
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
  }),
});

export const database = new Kysely<Database>({
  dialect,
});

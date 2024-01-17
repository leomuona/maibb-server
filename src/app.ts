import cors from "@fastify/cors";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import "dotenv/config";
import fastify from "fastify";
import { env } from "./config/env";
import jwtPlugin from "./plugins/jwt";
import authRoutes from "./routes/auth.routes";
import rootRoutes from "./routes/root.routes";

const app = fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

app.register(cors, {
  origin: (origin, callback) => {
    const hostname = origin && new URL(origin).hostname;
    if (hostname === "localhost") {
      // request from localhost will pass
      callback(null, true);
      return;
    }
    // generate an error on other origins, disabling access
    callback(new Error("Not allowed by CORS"), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

app.register(jwtPlugin);

app.register(rootRoutes);
app.register(authRoutes, { prefix: "/auth" });

const start = async () => {
  try {
    await app.listen({ port: env.PORT });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import "dotenv/config";
import fastify from "fastify";
import { env } from "./config/env";
import swaggerConfig from "./config/swagger.config";
import jwtPlugin from "./plugins/jwt";
import authRoutes from "./routes/auth.routes";
import rootRoutes from "./routes/root.routes";

const app = fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

app.register(cors, {
  hook: "preHandler",
  delegator: (req, callback) => {
    const corsOptions = {
      // This is NOT recommended for production as it enables reflection exploits
      origin: true,
    };

    // do not include CORS headers for requests from localhost
    if (req.headers.origin && /^localhost$/m.test(req.headers.origin)) {
      corsOptions.origin = false;
    }

    // callback expects two parameters: error and options
    callback(null, corsOptions);
  },
});

app.register(swagger, swaggerConfig);
app.register(swaggerUi, {
  routePrefix: "/docs",
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

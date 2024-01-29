const swaggerConfig = {
  swagger: {
    info: {
      title: "MaiBB Server",
      description: "Done with Fastify and Swagger",
      version: "0.0.1",
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "More info about Swagger",
    },
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      {
        name: "authentication",
        description: "Authentication related end-points",
      },
    ],
  },
};

export default swaggerConfig;

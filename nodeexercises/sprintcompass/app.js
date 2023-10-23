import fastify from "fastify";
import mercurius from "mercurius";
import { schema } from "./schema.js";
import { resolvers } from "./resolvers.js";
import * as cfg from "./config.js";
import cors from "@fastify/cors";
const app = fastify();
app.register(cors, {});
app.register(mercurius, {
  schema,
  resolvers,
  graphiql: true, // enable the GraphiQL web interface for testing queries
});

app.listen({ port: cfg.port });

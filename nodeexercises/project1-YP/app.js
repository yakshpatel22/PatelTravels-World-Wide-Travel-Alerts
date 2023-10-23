// import { graphql, server } from "./config.js";
// const port = process.env.PORT || 5000;
// import express from "express";
// import Fastify from "fastify";
// import mercurius from "mercurius";
// import pkg from "graphql";
// const { graphqlHTTP } = pkg;
// const app = express();
// import { resolvers } from "./resolvers.js";
// import { schema } from "./schema.js";
// import path from "path"; // needed for refresh
// //const cors = require("cors");
// //app.use(cors());
// app.use(express.static("public"));
// app.get("/*", (request, response) => {
//   // needed for refresh
//   response.sendFile(path.join(__dirname, "public/index.html"));
// });
// app.use(
//   graphql,
//   graphqlHTTP({
//     schema,
//     rootValue: resolvers,
//     graphiql: true,
//   })
// );
// app.listen(port);
// console.log(
//   `Server ready at ${server}:${port}${graphql} - ${process.env.NODE_ENV}`
// );
import Fastify from "fastify";
import mercurius from "mercurius";
import pkg from "graphql";
const { graphqlHTTP } = pkg;
import { resolvers } from "./resolvers.js";
import { schema } from "./schema.js";
import path from "path"; // needed for refresh

const server = Fastify();

server.register(mercurius, {
  schema,
  resolvers,
  graphiql: true,
});

server.get("/*", (request, reply) => {
  reply.sendFile("index.html", path.join(__dirname, "public"));
});

server.listen(5000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server ready at ${address}`);
});

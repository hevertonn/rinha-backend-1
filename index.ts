import router from "./src/routes.ts"

const server = Bun.serve({

  port: Bun.env.PORT,

  fetch(req) {
    return new Response("Heverton");
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);

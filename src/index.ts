const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/pessoas" && req.method === "POST") {
      return new Response("Ok")
    }
    if (url.pathname === "/pessoas/" && req.method === "GET") {
      return new Response("Ok")
    }
    if (url.pathname === "/pessoas?" && req.method === "GET") {
      return new Response("Ok")
    }
    if (url.pathname === "/contagem-pessoas" && req.method === "GET") {
      return new Response("Ok")
    }

    return new Response("Path not found", { status: 404 })
  },
})

console.log(`Server running on ${server.url.origin}`)

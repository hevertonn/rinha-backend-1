const server = Bun.serve({
  async fetch(req) {
    const { pathname } = new URL(req.url)

    if (req.method == "POST" && pathname == "/pessoas") {
      return new Response("OK")
    }

    else if (req.method == "GET" && pathname.startsWith("/pessoas/")) {
      console.log(pathname)
      return new Response(pathname.replace("/pessoas/", ""))
    }

    else if (req.method == "GET" && pathname.startsWith("/pessoas")) {
      const initTerm = req.url.indexOf("?")
      const term = req.url.slice(initTerm + 1)
      return new Response(term)
    }

    else if (req.method == "GET" && pathname == "/contagem-pessoas") {
      return new Response("contagem-pessoas")
    }

    return new Response("Path not found", { status: 404 })
  },
});

console.log(`Listening on ${server.url.origin} ...`);

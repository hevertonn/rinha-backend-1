import { createPerson, getPersonById, getPersonByQuery } from "./controllers";

const server = Bun.serve({
  async fetch(req) {
    const { pathname } = new URL(req.url)

    if (req.method == "POST" && pathname == "/pessoas") {
      const person = req.body
      const personId = await createPerson(person)
      return new Response("OK")
    }

    else if (req.method == "GET" && pathname.startsWith("/pessoas/")) {
      const id = pathname.replace("/pessoas/", "")
      const person = await getPersonById(id)
      return Response.json(person)
    }

    else if (req.method == "GET" && pathname.startsWith("/pessoas")) {
      const initTerm = req.url.indexOf("?")
      const term = req.url.slice(initTerm + 3)
      const people = await getPersonByQuery(term)
      return Response.json(people)
    }

    else if (req.method == "GET" && pathname == "/contagem-pessoas") {
      return new Response("contagem-pessoas")
    }

    return new Response("Path not found", { status: 404 })
  },
});

console.log(`Listening on ${server.url.origin} ...`);

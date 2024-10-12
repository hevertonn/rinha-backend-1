function validadePerson(body: any) {
  console.log(body)
}

const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);

    const path = {
      postPerson: "/pessoas",
      getPersonById: "/pessoas/",
      getPersonByQuery: "/pessoas",
      getPersonNumber: "/contagem-pessoas"
    }

    if (url.pathname === path.postPerson && req.method === "POST") {
      validadePerson(req.body)
      return new Response("Ok")
    }

    if (url.pathname.includes(path.getPersonById) && req.method === "GET") {
      const id = url.href.replace(url.origin + path.getPersonById, "")

      console.log(id)
      return new Response("Ok")
    }

    if (url.pathname.includes(path.getPersonByQuery) && req.method === "GET") {
      const queryParams = url.href.replace(url.origin +
        path.getPersonByQuery + "?t=", "").split(",")

      console.log(queryParams)
      return new Response("Ok")
    }

    if (url.pathname === path.getPersonNumber && req.method === "GET") {
      return new Response("Ok")
    }

    return new Response("Path not found", { status: 404 })
  },
})

console.log(`Server running on ${server.url.origin}`)

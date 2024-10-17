import postgres from "postgres";

const db = postgres(`postgres://postgres:1234@localhost:5432/rinha`)

async function validadeData(data: any) {
  if (data.apelido && data.name) {
    const apelidoInDb = await db`
      SELECT apelido FROM rinha
      WHERE apelido = ${data.apelido}
      `

    console.log(apelidoInDb)
  }


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
      const data = await req.json()
      validadeData(data)
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

console.log(`Server running on ${server.url}`)

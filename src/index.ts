import postgres from "postgres";

const db = postgres(`postgres://postgres:1234@db:5432/rinha`)

function validateStack(stack: any) {
  for (let e of stack) {
    if (typeof (e) != "string") {
      return true
    }
  }
}

async function validateData(data: any) {
  if (!data.apelido || !data.nome) {
    return new Response("Apelido e nome são necessários.", { status: 422 })
  }

  if (typeof (data.nome) != "string" || validateStack(data.stack)) {
    return new Response("Sintaxe invalida.", { status: 400 })
  }

  const apelidoExists = await db`
      SELECT apelido FROM pessoas
      WHERE apelido = ${data.apelido}
    `

  if (apelidoExists.length != 0) {
    return new Response("Apelido já existe.", { status: 422 })
  }
}

async function createPerson(data: any) {
  const person = await db`
    INSERT INTO pessoas (id, apelido, nome, nascimento, stack)
    VALUES (${crypto.randomUUID()}, ${data.apelido}, ${data.nome}, ${data.nascimento}, ${data.stack})
    returning id
  `
  return person[0]
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
      const notValid = await validateData(data)

      if (notValid) {
        return notValid
      }

      const person = await createPerson(data)

      return new Response(null, {
        headers: {
          "Location": url.origin + path.getPersonById + person.id
        }
      })
    }

    if (url.pathname.includes(path.getPersonById) && req.method === "GET") {
      const id = url.href.replace(url.origin + path.getPersonById, "")
      // return new Response(id)

      const people = await db`
        Select * From pessoas;
      `
      return Response.json(people)
    }

    if (url.pathname.includes(path.getPersonByQuery) && req.method === "GET") {
      const queryParams = url.href.replace(url.origin +
        path.getPersonByQuery + "?t=", "").split(",")

      return new Response("Params = " + queryParams)
    }

    if (url.pathname === path.getPersonNumber && req.method === "GET") {
      return new Response("Ok")
    }

    return new Response("Path not found", { status: 404 })
  },
})

console.log(`Server running on ${server.url}`)

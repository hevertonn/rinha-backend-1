import postgres from "postgres";

const db = postgres(`postgres://postgres:1234@localhost:5432/rinha`)

function validateStack(stack: any) {
  if (Array.isArray(stack)) {
    for (let e of stack) {
      if (typeof (e) != "string" || e.length > 32) {
        return true
      }
    }
  } else {
    if (typeof (stack) != "string" || stack.length > 32)
      return true
  }
}

async function validateData(data: any) {
  if (!data.apelido || !data.nome || !data.nascimento ||
    data.apelido.length > 32 || data.nome.length > 100 ||
    data.nascimento.length > 10 || Number.isNaN(Date.parse(data.nascimento))) {
    return new Response(null, { status: 422 })
  }

  if (typeof (data.nome) != "string" || validateStack(data.stack)) {
    return new Response(null, { status: 400 })
  }

  const apelido = await db`
      SELECT apelido FROM pessoas
      WHERE apelido = ${data.apelido}
    `

  if (apelido.length != 0) {
    return new Response(null, { status: 422 })
  }
}

async function createPerson(data: any) {
  const id = crypto.randomUUID()
  const person = await db`
    INSERT INTO pessoas (id, apelido, nome, nascimento, stack)
    VALUES (${id}, ${data.apelido}, ${data.nome}, ${data.nascimento}, ${data.stack})
  `
  return id
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

    if (url.pathname == path.postPerson && req.method == "POST") {
      const data = await req.json()
      const notValid = await validateData(data)

      if (notValid) {
        return notValid
      }

      const id = await createPerson(data)

      return new Response(null, {
        status: 201,
        headers: {
          "Location": url.origin + path.getPersonById + id
        }
      })
    }

    if (url.pathname.startsWith(path.getPersonById) && req.method == "GET") {
      const id = url.href.replace(url.origin + path.getPersonById, "")

      const person = await db`
        SELECT * FROM pessoas
        WHERE id = ${id};
      `
      return Response.json(person[0])
    }

    if (url.pathname.startsWith(path.getPersonByQuery) && req.method == "GET") {
      if (url.href.includes("?t=") == false) {
        return new Response(null, { status: 400 })
      }

      const queryParams = url.href.replace(url.origin +
        path.getPersonByQuery + "?t=", "")

      const data = await db`
        SELECT * FROM pessoas
        WHERE person_search ILIKE ${"%" + queryParams + "%"}
        LIMIT 50;
      `

      return Response.json(data)
    }

    if (url.pathname == path.getPersonNumber && req.method == "GET") {
      const numberOfPersons = await db`
        SELECT COUNT(*) FROM pessoas;
      `

      return new Response(numberOfPersons[0].count)
    }

    return new Response(null, { status: 404 })
  },
})

console.log(`Server running on ${server.url}`)

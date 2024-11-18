import postgres from "postgres";

const db = postgres(`postgres://postgres:1234@db:5432/rinha`)

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
  if (!data.apelido || !data.nome || !data.data ||
    data.apelido.length > 32 || data.nome.length > 100 || Number.isNaN(Date.parse(data.data))) {
    return new Response(null, { status: 422 })
  }

  if (typeof (data.nome) != "string" || validateStack(data.stack)) {
    return new Response(null, { status: 400 })
  }

  const apelidoExists = await db`
      SELECT apelido FROM pessoas
      WHERE apelido = ${data.apelido}
    `

  if (apelidoExists.length != 0) {
    return new Response(null, { status: 422 })
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

    if (url.pathname == path.postPerson && req.method == "POST") {
      const data = await req.json()
      const notValid = await validateData(data)

      if (notValid) {
        return notValid
      }

      const person = await createPerson(data)

      return new Response(null, {
        status: 201,
        headers: {
          "Location": url.origin + path.getPersonById + person.id
        }
      })
    }

    if (url.pathname.includes(path.getPersonById) && req.method == "GET") {
      const id = url.href.replace(url.origin + path.getPersonById, "")

      const person = await db`
        SELECT * FROM pessoas
        WHERE id = ${id};
      `
      return Response.json(person[0])
    }

    if (url.pathname.includes(path.getPersonByQuery) && req.method == "GET") {
      if (url.href.includes("?t=") == false) {
        return new Response(null, { status: 400 })
      }

      const queryParams = url.href.replace(url.origin +
        path.getPersonByQuery + "?t=", "")

      const people = await db`
        SELECT * FROM pessoas
        WHERE apelido ILIKE ${"%" + queryParams + "%"} OR
        nome ILIKE ${"%" + queryParams + "%"} OR
        stack ILIKE ${"%" + queryParams + "%"}
        LIMIT 50;
      `

      return Response.json(people)
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

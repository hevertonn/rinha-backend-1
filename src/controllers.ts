import db from "./db";

type Person = {
  uuid: String,
  apelido: String,
  nome: String,
  nascimento: Date,
  stack: Array<String>
}

async function createPerson(person: Person) {
  const newPerson = await db`
    INSERT INTO rinha
  `
}

async function getPersonById(id: String) {

  const person = await db`

`
}

async function getPersonByQuery(term: String) {
  const person = await db`
  
`
}

function getCountPerson() {
  const count = db`
  SELECT COUNT(id)
  FROM rinha;
`
}

export {
  createPerson,
  getPersonById,
  getPersonByQuery,
  getCountPerson
}

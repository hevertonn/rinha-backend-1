import postgres from "postgres";

const db = postgres("postgres://postgres:1234@localhost:5432/rinha")

export default db

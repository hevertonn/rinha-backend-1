CREATE TABLE IF NOT EXISTS pessoas (
    id varchar(36),
    apelido varchar(32) CONSTRAINT id_pk PRIMARY KEY,
    nome varchar(100),
    nascimento char(10),
    stack varchar(1024),
    person_search varchar(1024) GENERATED ALWAYS AS (apelido || nome || stack) STORED
);

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS person_search_idx ON pessoas USING gin((person_search) gin_trgm_ops);

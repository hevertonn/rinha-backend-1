CREATE TABLE pessoas (
    id varchar(36),
    apelido varchar(32) CONSTRAINT id_pk PRIMARY KEY,
    nome varchar(100),
    nascimento char(10),
    stack varchar(1024)
);

CREATE TABLE categoria
(
    id        BIGSERIAL PRIMARY KEY,
    nome      VARCHAR(255) NOT NULL UNIQUE,
    descricao VARCHAR(255) NOT NULL
);

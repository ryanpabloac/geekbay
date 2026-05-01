CREATE TABLE usuario
(
    id       BIGSERIAL PRIMARY KEY,
    nome     VARCHAR(255) NOT NULL,
    cpf      VARCHAR(14)  NOT NULL UNIQUE,
    email    VARCHAR(255) NOT NULL UNIQUE,
    telefone    VARCHAR(20),
    senha VARCHAR(255) NOT NULL,
    perfil  VARCHAR(20)  NOT NULL
);

INSERT INTO usuario (nome, cpf, email, telefone, senha, perfil)
VALUES ('Administrador',
        '00000000000',
        'admin@geekbay.com',
        '00000000000',
        'admin123',
        'ADMIN');
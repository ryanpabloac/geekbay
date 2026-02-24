CREATE TABLE usuario
(
    id       BIGSERIAL PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    cpf      VARCHAR(14)  NOT NULL UNIQUE,
    email    VARCHAR(255) NOT NULL UNIQUE,
    phone    VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    profile  VARCHAR(20)  NOT NULL
);

INSERT INTO usuario (name, cpf, email, phone, password, profile)
VALUES ('Administrador',
        '00000000000',
        'admin@geekbay.com',
        '00000000000',
        'admin123',
        'ADMIN');
-- ========================================
-- Sequence: endereco_seq
-- ========================================
CREATE SEQUENCE endereco_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- ========================================
-- Table: endereco
-- ========================================
CREATE TABLE endereco (
    id INTEGER PRIMARY KEY DEFAULT nextval('endereco_seq'),
    cep VARCHAR(20) NOT NULL,
    state VARCHAR(100),
    city VARCHAR(100),
    neighborhood VARCHAR(150),
    street VARCHAR(200),
    service VARCHAR(100),
    usuario_id INTEGER NOT NULL
);

-- ========================================
-- Vincula a sequence à coluna
-- ========================================
ALTER SEQUENCE endereco_seq
OWNED BY endereco.id;
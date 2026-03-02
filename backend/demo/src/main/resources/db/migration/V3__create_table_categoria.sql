-- ========================================
-- Sequence: categoria_seq
-- ========================================
CREATE SEQUENCE categoria_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- ========================================
-- Table: categoria
-- ========================================
CREATE TABLE categoria (
    id INTEGER PRIMARY KEY DEFAULT nextval('categoria_seq'),
    nome VARCHAR(255) NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

-- ========================================
-- Vincula a sequence à coluna (boa prática no PostgreSQL)
-- ========================================
ALTER SEQUENCE categoria_seq
OWNED BY categoria.id;
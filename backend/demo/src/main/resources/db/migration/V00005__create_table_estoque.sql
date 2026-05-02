-- ========================================
-- Sequence: estoque_seq
-- ========================================
CREATE SEQUENCE estoque_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- ========================================
-- Table: estoque
-- ========================================
CREATE TABLE estoque (
    id INTEGER PRIMARY KEY DEFAULT nextval('estoque_seq'),
    quantidade INTEGER NOT NULL,
    produto_id INTEGER UNIQUE,
    CONSTRAINT fk_estoque_produto
        FOREIGN KEY (produto_id)
        REFERENCES produto(id)
);

-- ========================================
-- Vincula a sequence à coluna
-- ========================================
ALTER SEQUENCE estoque_seq
OWNED BY estoque.id;
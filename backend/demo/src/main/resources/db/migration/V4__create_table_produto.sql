-- ========================================
-- Sequence: produto_seq
-- ========================================
CREATE SEQUENCE produto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- ========================================
-- Table: produto
-- ========================================
CREATE TABLE produto (
    id INTEGER PRIMARY KEY DEFAULT nextval('produto_seq'),
    nome VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT,
    preco NUMERIC(10,2) NOT NULL,
    imagem VARCHAR(500),
    categoria_id INTEGER,
    ativo BOOLEAN,

    CONSTRAINT fk_produto_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categoria(id)
);

-- ========================================
-- Vincula a sequence à coluna
-- ========================================
ALTER SEQUENCE produto_seq
OWNED BY produto.id;

-- ========================================
-- Índice para busca por categoria
-- ========================================
CREATE INDEX idx_produto_categoria
ON produto(categoria_id);
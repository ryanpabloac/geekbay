CREATE TABLE item_pedido (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMERIC(10,2) NOT NULL,
    produto_id BIGINT NOT NULL,
    pedido_id BIGINT NOT NULL,

    CONSTRAINT fk_item_pedido_produto FOREIGN KEY (produto_id) REFERENCES produto(id),
    CONSTRAINT fk_item_pedido_pedido FOREIGN KEY (pedido_id) REFERENCES pedido(id)
);

CREATE INDEX idx_item_pedido_produto ON item_pedido(produto_id);
CREATE INDEX idx_item_pedido_pedido ON item_pedido(pedido_id);
CREATE UNIQUE INDEX uq_item_pedido_produto ON item_pedido(pedido_id, produto_id);
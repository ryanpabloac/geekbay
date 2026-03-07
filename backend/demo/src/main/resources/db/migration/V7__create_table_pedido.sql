CREATE TABLE pedido (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    data_pedido TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'CARRINHO',
    valor_total NUMERIC(10,2),
    valor_frete NUMERIC(10,2),
    endereco_id BIGINT,
    usuario_id BIGINT NOT NULL,

    CONSTRAINT fk_pedido_endereco FOREIGN KEY (endereco_id) REFERENCES endereco(id),
    CONSTRAINT fk_pedido_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE UNIQUE INDEX idx_pedido_carrinho_por_usuario ON pedido(usuario_id) WHERE status = 'CARRINHO';
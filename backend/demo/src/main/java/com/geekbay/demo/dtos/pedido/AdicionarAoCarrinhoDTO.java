package com.geekbay.demo.dtos.pedido;

public record AdicionarAoCarrinhoDTO(
        long usuarioId,
        int produtoId,
        int quantidade
) {
}

package com.geekbay.demo.dtos.pedido;

public record AdicionarAoCarrinhoDTO(
        Long usuarioId,
        Integer produtoId,
        Integer quantidade
) {
}

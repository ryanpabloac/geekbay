package com.geekbay.demo.dtos.pedido;

public record AtualizarQuantidadeDTO(
        Long usuarioId,
        Long itemPedidoId,
        int quantidade
) {}
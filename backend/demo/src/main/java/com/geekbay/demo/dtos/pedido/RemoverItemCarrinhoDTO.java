package com.geekbay.demo.dtos.pedido;

public record RemoverItemCarrinhoDTO(
        Long usuarioId,
        Long itemId
) {}
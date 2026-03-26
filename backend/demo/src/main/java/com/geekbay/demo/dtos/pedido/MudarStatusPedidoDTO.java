package com.geekbay.demo.dtos.pedido;

import com.geekbay.demo.enums.OrderStatus;

public record MudarStatusPedidoDTO(
        Long usuarioId,
        Long pedidoId,
        OrderStatus status
) {}
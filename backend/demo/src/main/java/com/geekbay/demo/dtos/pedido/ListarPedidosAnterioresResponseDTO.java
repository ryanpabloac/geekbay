package com.geekbay.demo.dtos.pedido;

import com.geekbay.demo.entities.pedido.Pedido;

import java.util.List;

public record ListarPedidosAnterioresResponseDTO(
        List<Pedido> pedidos
) {}
package com.geekbay.demo.dtos.pedido;

import com.geekbay.demo.dtos.produto.ProdutoResponseDTO;

public record ItemPedidoRequestDTO(
        Long id,
        ProdutoResponseDTO produto,
        Integer quantidade

) {}

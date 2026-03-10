package com.geekbay.demo.dtos.pedido;

import com.geekbay.demo.dtos.produto.ProdutoResponseDTO;
import com.geekbay.demo.entities.pedido.ItemPedido;

record ItemPedidoResponseDTO(
        Long id,
        ProdutoResponseDTO produto,
        Integer quantidade
) {
    public ItemPedidoResponseDTO(ItemPedido itemPedido) {
        this(itemPedido.getId(), new ProdutoResponseDTO(itemPedido.getProduto()), itemPedido.getQuantidade());
    }
}

package com.geekbay.demo.dtos.pedido;

import com.geekbay.demo.entities.pedido.ItemPedido;
import com.geekbay.demo.entities.pedido.Pedido;

import java.math.BigDecimal;
import java.util.List;

public record CarrinhoResposeDTO(
        Long id,
        List<ItemPedidoResponseDTO> itens,
        BigDecimal valorTotal,
        BigDecimal valorFrete
) {
    public CarrinhoResposeDTO(Pedido pedido, BigDecimal valorTotal, BigDecimal valorFrete) {
        this(
            pedido.getId(),
            pedido.getItens().stream().map(ItemPedidoResponseDTO::new).toList(),
            valorTotal,
            valorFrete
        );
    }
}

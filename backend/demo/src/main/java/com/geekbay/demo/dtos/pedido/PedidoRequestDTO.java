package com.geekbay.demo.dtos.pedido;

import com.geekbay.demo.entities.endereco.Endereco;
import com.geekbay.demo.entities.pedido.ItemPedido;
import com.geekbay.demo.entities.usuario.Usuario;
import com.geekbay.demo.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoRequestDTO(
        @NotNull
        Long id,
        LocalDateTime dataPedido,
        OrderStatus status,
        BigDecimal valorTotal,
        BigDecimal valorFrete,
        Endereco endereco,
        Usuario usuario,
        List<ItemPedido> itens
) {}

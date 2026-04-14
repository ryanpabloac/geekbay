package com.geekbay.demo.dtos.pedido;

import com.geekbay.demo.dtos.endereco.EnderecoResponseDTO;
import com.geekbay.demo.dtos.usuario.UsuarioResponseDTO;
import com.geekbay.demo.entities.endereco.Endereco;
import com.geekbay.demo.entities.pedido.ItemPedido;
import com.geekbay.demo.entities.pedido.Pedido;
import com.geekbay.demo.entities.usuario.Usuario;
import com.geekbay.demo.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponseDTO(
        Long id,
        LocalDateTime dataPedido,
        OrderStatus status,
        BigDecimal valorTotal,
        BigDecimal valorFrete,
        EnderecoResponseDTO endereco,
        UsuarioResponseDTO usuarioResponseDTO,
        List<ItemPedido> itens
) {
    public PedidoResponseDTO(Pedido pedido) {
        this(
                pedido.getId(),
                pedido.getDataPedido(),
                pedido.getStatus(),
                pedido.getValorTotal(),
                pedido.getValorFrete(),
                new EnderecoResponseDTO(pedido.getEndereco()),
                new UsuarioResponseDTO(pedido.getUsuario()),
                pedido.getItens()
        );
    }
}
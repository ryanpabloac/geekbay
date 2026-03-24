package com.geekbay.demo.services;

import com.geekbay.demo.dtos.pedido.CancelarPedidoDTO;
import com.geekbay.demo.dtos.pedido.ListarPedidosAnterioresResponseDTO;
import com.geekbay.demo.entities.pedido.Pedido;
import com.geekbay.demo.enums.OrderStatus;
import com.geekbay.demo.exceptions.NotFoundException;
import com.geekbay.demo.exceptions.UnauthorizedOperationException;
import com.geekbay.demo.repositories.PedidoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    public ListarPedidosAnterioresResponseDTO listLastOrders(Long usuarioId) {
        List<Pedido> pedidos = pedidoRepository.findByUsuarioId(usuarioId);
        return new ListarPedidosAnterioresResponseDTO(pedidos);
    }

    public void cancelOrder(CancelarPedidoDTO request) {
        Optional<Pedido> optionalPedido = pedidoRepository.findById(request.pedidoId());
        if(optionalPedido.isEmpty()) throw  new NotFoundException("Pedido não encontrado");

        Pedido pedido = optionalPedido.get();
        if(!pedido.getUsuario().getId().equals(request.usuarioId())) {
            throw new UnauthorizedOperationException("Impossível cancelar pedido de outro usuário");
        }

        pedido.changeStatus(OrderStatus.CANCELADO);
        pedido.setDataPedido(LocalDateTime.now());
        pedidoRepository.save(pedido);
    }
}

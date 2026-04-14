package com.geekbay.demo.services;

import com.geekbay.demo.dtos.pedido.CancelarPedidoDTO;
import com.geekbay.demo.dtos.pedido.ListarPedidosAnterioresResponseDTO;
import com.geekbay.demo.dtos.pedido.PedidoResponseDTO;
import com.geekbay.demo.entities.pedido.Pedido;
import com.geekbay.demo.enums.OrderStatus;
import com.geekbay.demo.exceptions.NotFoundException;
import com.geekbay.demo.exceptions.UnauthorizedOperationException;
import com.geekbay.demo.repositories.PedidoRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    public List<PedidoResponseDTO> listLastOrders(Long usuarioId) {
        List<PedidoResponseDTO> pedidos = pedidoRepository.findByUsuarioId(usuarioId)
                .stream().map(pedido -> new PedidoResponseDTO(pedido)).toList();
        return pedidos;
    }

    public List<PedidoResponseDTO> getAllOrdersList(){
        return this.pedidoRepository
                .findAll(Sort.by("id").ascending())
                .stream()
                .map(pedido -> new PedidoResponseDTO(pedido))
                .toList();
    }

    public List<PedidoResponseDTO> getLastOrdersByStatus(String status){
        //OrderStatus statusString = Enum.valueOf(OrderStatus.class, status);
        List<PedidoResponseDTO> ordersListQuery = this.pedidoRepository
                .findAll()
                .stream()
                .filter(pedido -> pedido.getStatus().toString().equalsIgnoreCase(status))
                .map(pedido -> new PedidoResponseDTO(pedido))
                .toList();  // Filtro pra remover maiúsculas
        if(ordersListQuery.isEmpty()) throw new NotFoundException("Nenhum pedido com esse status");
        return ordersListQuery;
    }

    @Transactional
    public void updateOrderStatusByPedidoId(Long id, String status){
        Optional<Pedido> pedidoQuery = this.pedidoRepository.findById(id);
        if(pedidoQuery.isEmpty()) throw new NotFoundException("Pedido não encontrado");
        OrderStatus statusUpdate = Enum.valueOf(OrderStatus.class, status.toUpperCase());
        pedidoQuery.get().changeStatus(statusUpdate);
    }


    @Transactional
    public void cancelOrder(CancelarPedidoDTO request) {
        Optional<Pedido> optionalPedido = pedidoRepository.findById(request.pedidoId());
        if(optionalPedido.isEmpty()) throw new NotFoundException("Pedido não encontrado");

        Pedido pedido = optionalPedido.get();
        if(!pedido.getUsuario().getId().equals(request.usuarioId())) {
            throw new UnauthorizedOperationException("Impossível cancelar pedido de outro usuário");
        }

        pedido.changeStatus(OrderStatus.CANCELADO);
        pedido.setDataPedido(LocalDateTime.now());
        //pedidoRepository.save(pedido);
    }

}

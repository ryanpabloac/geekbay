package com.geekbay.demo.services;

import com.geekbay.demo.dtos.pedido.CancelarPedidoDTO;
import com.geekbay.demo.dtos.pedido.ListarPedidosAnterioresResponseDTO;
import com.geekbay.demo.dtos.pedido.MudarStatusPedidoDTO;
import com.geekbay.demo.dtos.pedido.PedidoResponseDTO;
import com.geekbay.demo.entities.Usuario;
import com.geekbay.demo.entities.pedido.Pedido;
import com.geekbay.demo.enums.OrderStatus;
import com.geekbay.demo.enums.Profile;
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
    private final UsuarioService usuarioService;

    public ListarPedidosAnterioresResponseDTO listLastOrders(Long usuarioId) {
        List<Pedido> pedidos = pedidoRepository.findByUsuarioId(usuarioId);
        return new ListarPedidosAnterioresResponseDTO(pedidos);
    }

    public PedidoResponseDTO cancelOrder(CancelarPedidoDTO request) {
        Optional<Pedido> optionalPedido = pedidoRepository.findById(request.pedidoId());
        if(optionalPedido.isEmpty()) throw  new NotFoundException("Pedido não encontrado");

        Pedido pedido = optionalPedido.get();
        if(!pedido.getUsuario().getId().equals(request.usuarioId())) {
            throw new UnauthorizedOperationException("Impossível cancelar pedido de outro usuário");
        }


        pedido.changeStatus(OrderStatus.CANCELADO);
        pedido.setDataPedido(LocalDateTime.now());
        pedidoRepository.save(pedido);

        return new PedidoResponseDTO(pedido);
    }

    public void changeOrderStatus(MudarStatusPedidoDTO request) {
        Usuario usuario = usuarioService.getUser(request.usuarioId());

        if(usuario.getPerfil() == Profile.CLIENTE)
            throw new UnauthorizedOperationException("Sem permissão para mudar status do pedido");

        Optional<Pedido> optionalPedido = pedidoRepository.findById(request.pedidoId());
        if(optionalPedido.isEmpty()) throw  new NotFoundException("Pedido não encontrado");

        Pedido pedido = optionalPedido.get();
        pedido.changeStatus(request.status());
        pedidoRepository.save(pedido);
    }
}

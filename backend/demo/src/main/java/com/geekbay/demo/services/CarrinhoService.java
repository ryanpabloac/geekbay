package com.geekbay.demo.services;

import com.geekbay.demo.dtos.pedido.CarrinhoResposeDTO;
import com.geekbay.demo.entities.Usuario;
import com.geekbay.demo.entities.pedido.ItemPedido;
import com.geekbay.demo.entities.pedido.Pedido;
import com.geekbay.demo.enums.OrderStatus;
import com.geekbay.demo.mappers.CarrinhoMapper;
import com.geekbay.demo.repositories.PedidoRepository;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@AllArgsConstructor
public class CarrinhoService {
    private final UsuarioService usuarioService;
    private final CarrinhoMapper carrinhoMapper;
    private final PedidoRepository pedidoRepository;

    public CarrinhoResposeDTO getCarrinho(Long usuarioId) {
        Usuario usuario = usuarioService.getUser(usuarioId);

        List<Pedido> pedidoList = pedidoRepository.findByUsuarioIdAndStatus(usuarioId, OrderStatus.CARRINHO);
        Pedido carrinho;
        if (pedidoList.isEmpty()) {
             carrinho = new Pedido(usuario);
            pedidoRepository.save(carrinho);
        }

        carrinho = pedidoList.getFirst();
        BigDecimal valorTotal = new BigDecimal(0);

        for(ItemPedido i : carrinho.getItens())
            valorTotal.add(i.getPedido().getValorTotal());


        BigDecimal valorFrete = new BigDecimal(0.1 * valorTotal.doubleValue());

        return carrinhoMapper.toResponseDTO(pedidoList.getFirst(), valorTotal, valorFrete);
    }
}
package com.geekbay.demo.services;

import com.geekbay.demo.dtos.pedido.AdicionarAoCarrinhoDTO;
import com.geekbay.demo.dtos.pedido.CarrinhoResposeDTO;
import com.geekbay.demo.dtos.produto.ProdutoResponseDTO;
import com.geekbay.demo.entities.Usuario;
import com.geekbay.demo.entities.pedido.ItemPedido;
import com.geekbay.demo.entities.pedido.Pedido;
import com.geekbay.demo.entities.produto.Produto;
import com.geekbay.demo.enums.OrderStatus;
import com.geekbay.demo.mappers.CarrinhoMapper;
import com.geekbay.demo.mappers.ProdutoMapper;
import com.geekbay.demo.repositories.PedidoRepository;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@AllArgsConstructor
public class CarrinhoService {
    private final UsuarioService usuarioService;
    private final ProdutoService produtoService;
    private final EstoqueService estoqueService;
    private final CarrinhoMapper carrinhoMapper;
    private final ProdutoMapper produtoMapper;
    private final PedidoRepository pedidoRepository;

    private Pedido getOuCriarCarrinho(Long usuarioId) {
        Usuario usuario = usuarioService.getUser(usuarioId);

        List<Pedido> pedidoList = pedidoRepository.findByUsuarioIdAndStatus(usuarioId, OrderStatus.CARRINHO);
        Pedido carrinho;
        if (pedidoList.isEmpty()) {
            carrinho = new Pedido(usuario);
            pedidoRepository.save(carrinho);
        }
        else carrinho = pedidoList.getFirst();

        return carrinho;
    }

    public CarrinhoResposeDTO getCarrinho(Long usuarioId) {
        Pedido carrinho = getOuCriarCarrinho(usuarioId);

        BigDecimal valorTotal = BigDecimal.ZERO;

        for(ItemPedido i : carrinho.getItens())
            valorTotal = valorTotal.add(i.calcularSubtotal());

        BigDecimal valorFrete = valorTotal.multiply(new BigDecimal("0.1"));

        return carrinhoMapper.toResponseDTO(carrinho, valorTotal, valorFrete);
    }

    public CarrinhoResposeDTO adicionarAoCarinho(AdicionarAoCarrinhoDTO dto) {
        Pedido carrinho = getOuCriarCarrinho(dto.usuarioId());

        ProdutoResponseDTO produtoDTO = this.produtoService.getProdutoById(dto.produtoId());
        Produto produto = produtoMapper.toEntity(produtoDTO);

        estoqueService.validateDisponibilidade(produto.getId(), dto.quantidade());

        carrinho.adicionarItem(produto, dto.quantidade());
        this.pedidoRepository.save(carrinho);

        BigDecimal valorTotal = carrinho.calcularSubtotal();
        BigDecimal valorFrete = valorTotal.multiply(new BigDecimal("0.1"));

        return carrinhoMapper.toResponseDTO(carrinho, valorTotal, valorFrete);
    }
}
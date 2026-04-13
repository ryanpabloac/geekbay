package com.geekbay.demo.services;

import com.geekbay.demo.dtos.endereco.EnderecoResponseDTO;
import com.geekbay.demo.dtos.pedido.*;
import com.geekbay.demo.dtos.produto.ProdutoResponseDTO;
import com.geekbay.demo.dtos.usuario.UsuarioResponseDTO;
import com.geekbay.demo.entities.usuario.Usuario;
import com.geekbay.demo.entities.endereco.Endereco;
import com.geekbay.demo.entities.pedido.*;
import com.geekbay.demo.entities.produto.Produto;
import com.geekbay.demo.enums.OrderStatus;
import com.geekbay.demo.exceptions.NotFoundException;
import com.geekbay.demo.mappers.CarrinhoMapper;
import com.geekbay.demo.mappers.ProdutoMapper;
import com.geekbay.demo.repositories.PedidoRepository;

import com.geekbay.demo.repositories.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
    private final EnderecoService enderecoService;
    private final UsuarioRepository usuarioRepository;

    private Pedido getOuCriarCarrinho(Long usuarioId) {
        Usuario usuario = this.usuarioRepository.findById(usuarioId).get();

        List<Pedido> pedidoList = pedidoRepository.findByUsuarioIdAndStatus(usuarioId, OrderStatus.CARRINHO);
        Pedido carrinho;
        if (pedidoList.isEmpty()) {
            carrinho = new Pedido(usuario); // Criar mapper pra converter DTO usuario
            pedidoRepository.save(carrinho);
        }
        else carrinho = pedidoList.getFirst();

        return carrinho;
    }

    public CarrinhoResposeDTO getCarrinho(Long usuarioId) {
        Pedido carrinho = getOuCriarCarrinho(usuarioId);

        return carrinhoMapper.toResponseDTO(carrinho, carrinho.getValorTotal(), carrinho.getValorFrete());
        //return carrinhoMapper.toResponseDTO(carrinho, valorTotal, valorFrete);
    }

    public CarrinhoResposeDTO adicionarAoCarinho(AdicionarAoCarrinhoDTO dto) {
        Pedido carrinho = getOuCriarCarrinho(dto.usuarioId());

        ProdutoResponseDTO produtoDTO = this.produtoService.getProdutoById(dto.produtoId());
        Produto produto = produtoMapper.toEntity(produtoDTO);

        estoqueService.validateDisponibilidade(produto.getId(), dto.quantidade());

        carrinho.adicionarItem(produto, dto.quantidade());

        BigDecimal valorTotal = carrinho.calcularSubtotal();
        BigDecimal valorFrete = valorTotal.multiply(new BigDecimal("0.1"));
        carrinho.setValorTotal(valorTotal);
        carrinho.setValorFrete(valorFrete);

        this.pedidoRepository.save(carrinho);

        //return new CarrinhoResposeDTO(carrinho, valorTotal, valorFrete);
        return carrinhoMapper.toResponseDTO(carrinho, valorTotal, valorFrete);
    }

    @Transactional
    public void removerDoCarrinho(RemoverItemCarrinhoDTO dto) {
        Pedido carrinho = getOuCriarCarrinho(dto.usuarioId());

        carrinho.getItens().removeIf(i -> i.getId().equals(dto.itemId()));
        pedidoRepository.save(carrinho);
    }

    public CarrinhoResposeDTO atualizarQuantidade(AtualizarQuantidadeDTO dto) {
        Pedido carrinho = getOuCriarCarrinho(dto.usuarioId());
        ItemPedido itemPedido = carrinho.getItemPedidoById(dto.itemPedidoId());
        carrinho.modificarQuantidade(itemPedido.getProduto(), dto.quantidade());

        this.pedidoRepository.save(carrinho);
        BigDecimal valorTotal = carrinho.calcularSubtotal();
        BigDecimal valorFrete = valorTotal.multiply(new BigDecimal("0.1"));

        return carrinhoMapper.toResponseDTO(carrinho, valorTotal, valorFrete);
    }

    public PedidoResponseDTO checkout(CheckoutDTO dto) {
        Pedido carrinho = getOuCriarCarrinho(dto.usuarioId());
        if(carrinho.getItens().isEmpty()) throw new NotFoundException("Carrinho não localizado");

        EnderecoResponseDTO enderecoDTO = enderecoService.getEnderecoByUsuarioId(dto.usuarioId());
        Usuario usuarioCarrinho = usuarioRepository.findById(dto.usuarioId()).get();
        UsuarioResponseDTO usuarioResponseDTO = new UsuarioResponseDTO(usuarioCarrinho);

        carrinho.setEndereco(new Endereco(
                enderecoDTO.cep(),
                enderecoDTO.state(),
                enderecoDTO.city(),
                enderecoDTO.neighborhood(),
                enderecoDTO.street(),
                enderecoDTO.service(),
                enderecoDTO.number(),
                enderecoDTO.complement(),
                usuarioCarrinho
        ));

        carrinho.setDataPedido(LocalDateTime.now());
        carrinho.changeStatus(OrderStatus.PROCESSANDO);

        pedidoRepository.save(carrinho);

        return new PedidoResponseDTO(
                carrinho.getId(),
                LocalDateTime.now(),
                OrderStatus.PROCESSANDO,
                carrinho.getValorTotal(),
                carrinho.getValorFrete(),
                enderecoDTO,
                usuarioResponseDTO,
                carrinho.getItens()
        );
        //return new PedidoResponseDTO(carrinho);
    }
}
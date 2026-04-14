package com.geekbay.demo.services;

import com.geekbay.demo.dtos.endereco.EnderecoResponseDTO;
import com.geekbay.demo.dtos.pedido.*;
import com.geekbay.demo.dtos.produto.ProdutoResponseDTO;
import com.geekbay.demo.dtos.usuario.UsuarioResponseDTO;
import com.geekbay.demo.entities.estoque.Estoque;
import com.geekbay.demo.entities.usuario.Usuario;
import com.geekbay.demo.entities.endereco.Endereco;
import com.geekbay.demo.entities.pedido.*;
import com.geekbay.demo.entities.produto.Produto;
import com.geekbay.demo.enums.OrderStatus;
import com.geekbay.demo.exceptions.NotFoundException;
import com.geekbay.demo.exceptions.ProductUnavailableException;
import com.geekbay.demo.mappers.CarrinhoMapper;
import com.geekbay.demo.mappers.ProdutoMapper;
import com.geekbay.demo.repositories.*;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class CarrinhoService {
    private final UsuarioService usuarioService;
    private final ProdutoService produtoService;
    private final EstoqueService estoqueService;
    private final CarrinhoMapper carrinhoMapper;
    private final ProdutoMapper produtoMapper;
    private final ProdutoRepository produtoRepository;
    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EnderecoRepository enderecoRepository;
    private final EstoqueRepository estoqueRepository;

    private Pedido getOuCriarCarrinho(Long usuarioId) {
        Usuario usuario = this.usuarioRepository.findById(usuarioId).get();

        List<Pedido> pedidoList = pedidoRepository.findByUsuarioIdAndStatus(usuarioId, OrderStatus.CARRINHO);
        Pedido carrinho;
        if (pedidoList.isEmpty()) {
            carrinho = new Pedido(usuario);
            pedidoRepository.save(carrinho);
        }
        else {
            carrinho = pedidoList.getFirst();
            // Forçar carregamento dos itens (Lazy Loading)
            Hibernate.initialize(carrinho.getItens());
        }

        return carrinho;
    }

    public CarrinhoResposeDTO getCarrinho(Long usuarioId) {
        Pedido carrinho = getOuCriarCarrinho(usuarioId);

        return carrinhoMapper.toResponseDTO(carrinho, carrinho.getValorTotal(), carrinho.getValorFrete());
        //return carrinhoMapper.toResponseDTO(carrinho, valorTotal, valorFrete);
    }

    public CarrinhoResposeDTO adicionarAoCarinho(AdicionarAoCarrinhoDTO dto) {
        Pedido carrinho = getOuCriarCarrinho(dto.usuarioId());

        //ProdutoResponseDTO produtoDTO = this.produtoService.getProdutoById(dto.produtoId());
        //Produto produto = produtoMapper.toEntity(produtoDTO);

        Produto produto = this.produtoRepository.findById(dto.produtoId()).get();

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

        ItemPedido itemCarrinho = carrinho.getItens().stream()
                .filter(itemPedido -> itemPedido.getId().equals(dto.itemId()))
                .findFirst()
                .orElseThrow(() -> new ProductUnavailableException("Item inexistente no pedido"));

        carrinho.getItens().remove(itemCarrinho);
        carrinho.setValorTotal(
                carrinho.getValorTotal().subtract(itemCarrinho.calcularSubtotal()));
        carrinho.setValorFrete(
                carrinho.getValorTotal().multiply(new BigDecimal("0.1"))
        );
        //carrinho.getItens().removeIf(i -> i.getId().equals(dto.itemId()));
        //pedidoRepository.save(carrinho);
    }

    @Transactional
    public CarrinhoResposeDTO atualizarQuantidade(AtualizarQuantidadeDTO dto) {
        Pedido carrinho = getOuCriarCarrinho(dto.usuarioId());
        ItemPedido itemCarrinho = carrinho.getItens()
                .stream()
                .filter(itemPedido-> itemPedido.getId().equals(dto.itemPedidoId()))
                .findFirst()
                .orElseThrow(() -> new ProductUnavailableException("Item inexistente no pedido"));

        //ItemPedido itemPedido = carrinho.getItemPedidoById(dto.itemPedidoId());
        //carrinho.modificarQuantidade(itemPedido.getProduto(), dto.quantidade());
        carrinho.modificarQuantidade(itemCarrinho.getProduto(), dto.quantidade());

        //this.pedidoRepository.save(carrinho);
        BigDecimal valorTotal = carrinho.calcularSubtotal();
        BigDecimal valorFrete = valorTotal.multiply(new BigDecimal("0.1"));

        return carrinhoMapper.toResponseDTO(carrinho, valorTotal, valorFrete);
    }

    public PedidoResponseDTO checkout(CheckoutDTO dto) {
        Pedido carrinho = getOuCriarCarrinho(dto.usuarioId());
        if(carrinho.getItens().isEmpty()) throw new NotFoundException("Carrinho não localizado");

        Usuario usuarioCarrinho = usuarioRepository.findById(dto.usuarioId()).get();
        UsuarioResponseDTO usuarioResponseDTO = new UsuarioResponseDTO(usuarioCarrinho);

        // Busca o endereço existente no banco para evitar duplicação
        Endereco endereco = enderecoRepository.findByUsuario_Id(dto.usuarioId());
        if (endereco == null) {
            throw new NotFoundException("Endereço não encontrado para o usuário");
        }
        carrinho.setEndereco(endereco);

        carrinho.setDataPedido(LocalDateTime.now());
        carrinho.changeStatus(OrderStatus.PROCESSANDO);

        pedidoRepository.save(carrinho);

        List<Estoque> estoqueList = this.estoqueRepository.findAll();
        List<ItemPedido> itensCarrinho = carrinho.getItens();
        List<Estoque> estoqueUpdate = new ArrayList<>();
        for(ItemPedido i: itensCarrinho){
            // Buscar estoque com produto_id igual ao id do produto correspondente ao item
            Estoque estoque = estoqueList.stream()
                    .filter(estoque1 -> estoque1.getProduto().getId() == i.getProduto().getId())
                    .findFirst()
                    .get();
            // Alterar quantidade do estoque, subtraindo a quantidade atual pela quantidade do item
            estoque.setQuantidade(estoque.getQuantidade() - i.getQuantidade());
            estoqueUpdate.add(estoque);
        }
        this.estoqueRepository.saveAll(estoqueUpdate);

        EnderecoResponseDTO enderecoResponseDTO = new EnderecoResponseDTO(endereco);
        return new PedidoResponseDTO(
                carrinho.getId(),
                LocalDateTime.now(),
                OrderStatus.PROCESSANDO,
                carrinho.getValorTotal(),
                carrinho.getValorFrete(),
                enderecoResponseDTO,
                usuarioResponseDTO,
                carrinho.getItens()
        );
        //return new PedidoResponseDTO(carrinho);
    }
}
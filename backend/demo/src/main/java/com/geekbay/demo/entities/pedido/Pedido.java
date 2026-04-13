package com.geekbay.demo.entities.pedido;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.geekbay.demo.entities.usuario.Usuario;
import com.geekbay.demo.entities.endereco.Endereco;
import com.geekbay.demo.entities.produto.Produto;
import com.geekbay.demo.enums.OrderStatus;
import com.geekbay.demo.exceptions.*;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;

@Getter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
public class Pedido {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private LocalDateTime dataPedido;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private BigDecimal valorTotal;
    private BigDecimal valorFrete;

    @ManyToOne
    @Cascade(org.hibernate.annotations.CascadeType.MERGE)
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;

    @ManyToOne
    @Cascade(org.hibernate.annotations.CascadeType.MERGE)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @JsonManagedReference
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens;

    public Pedido(Usuario usuario) {
        Objects.requireNonNull(usuario, "Usuário é obrigatório");
        this.usuario = usuario;
        this.status = OrderStatus.CARRINHO;
        this.itens = new ArrayList<>();
    }
    public Pedido(){}

    public void setDataPedido(LocalDateTime dataPedido) {
        Objects.requireNonNull(dataPedido, "Data do pedido é obrigatório");

        if(dataPedido.isAfter(LocalDateTime.now()))
            throw new InvalidOrderDateException("Data do pedido não pode ser no futuro");
        this.dataPedido = dataPedido;
    }

    public void changeStatus(OrderStatus status) {
        Objects.requireNonNull(status, "Status é obrigatório");

        this.status = status;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        Objects.requireNonNull(valorTotal, "Valor total é obrigatório");

        if(valorTotal.compareTo(BigDecimal.ZERO) < 0)
            throw new InvalidValueException("Valor total deve ser um valor positivo");

        this.valorTotal = valorTotal;
    }

    public void setValorFrete(BigDecimal valorFrete) {
        Objects.requireNonNull(valorFrete, "Valor de frete é obrigatório");

        if(valorFrete.compareTo(BigDecimal.ZERO) < 0)
            throw new InvalidValueException("Valor de frete deve ser um valor positivo");

        this.valorFrete = valorFrete;
    }

    public void setEndereco(Endereco endereco) {
        Objects.requireNonNull(endereco, "Endereço é obrigatório");

        this.endereco = endereco;
    }

    public void adicionarItem(Produto produto, int quantidade) {
        if(!this.status.equals(OrderStatus.CARRINHO))
            throw new UnauthorizedOperationException("Não é possível alterar um pedido depois de finalizado");

        ItemPedido itemPedido = new ItemPedido(quantidade,produto,this);
        this.itens.add(itemPedido);
    }

    public void removerItem(Produto produto) {
        if(!this.status.equals(OrderStatus.CARRINHO))
            throw new UnauthorizedOperationException("Não é possível alterar um pedido depois de finalizado");

        itens.removeIf(ip -> ip.getProduto().equals(produto));
    }

    public void modificarQuantidade(Produto produto, int quantidade) {
        if(!this.status.equals(OrderStatus.CARRINHO))
            throw new UnauthorizedOperationException("Não é possível alterar um pedido depois de finalizado");

        Stream<ItemPedido> itemPedidoStream = itens.stream()
                .filter(ip -> ip.getProduto().equals(produto));

        Optional<ItemPedido> itemPedido = itemPedidoStream.findFirst();
        if(itemPedido.isEmpty())
            throw new NotFoundException(
                    String.format("Produto '%s' não está presente no pedido", produto.getNome())
            );

        itemPedido.get().setQuantidade(quantidade);
    }

    public BigDecimal calcularSubtotal() {
        BigDecimal subtotal = BigDecimal.ZERO;
        for(ItemPedido i : itens) {
            BigDecimal valor =  BigDecimal.valueOf(i.getProduto().getPreco() * i.getQuantidade());
            subtotal = subtotal.add(valor);
        }

        return subtotal;
    }

    public ItemPedido getItemPedidoById(Long itemPedidoId) {
        return itens.stream()
                .filter(i -> i.getId().equals(itemPedidoId))
                .findFirst()
                .orElseThrow(() -> new ProductUnavailableException("Item inexistente no pedido"));
    }

}
package com.geekbay.demo.entities.pedido;

import com.geekbay.demo.entities.Usuario;
import com.geekbay.demo.entities.endereco.Endereco;
import com.geekbay.demo.entities.produto.Produto;
import com.geekbay.demo.enums.OrderStatus;
import com.geekbay.demo.exceptions.InvalidOrderDateException;
import com.geekbay.demo.exceptions.InvalidValueException;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Getter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "item_pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens;

    public Pedido(Usuario usuario) {
        Objects.requireNonNull(usuario, "Usuário é obrigatório");
        this.usuario = usuario;
    }

    public void setDataPedido(LocalDateTime dataPedido) {
        Objects.requireNonNull(dataPedido, "Data do pedido é obrigatório");

        if(dataPedido.isAfter(LocalDateTime.now()))
            throw new InvalidOrderDateException("Data do pedido não poder ser no futuro");
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

    public void addItem(Produto produto, int quantidade) {
        if(quantidade < 0)
            throw new InvalidValueException("Quantidade deve ser uma valor positivo");

        ItemPedido itemPedido = new ItemPedido(quantidade,produto,this);
        this.itens.add(itemPedido);
    }

    public void removeItem(ItemPedido itemPedido) {
        itens.removeIf(ip -> ip.equals(itemPedido));
    }
}
package com.geekbay.demo.entities.pedido;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.geekbay.demo.entities.produto.Produto;
import com.geekbay.demo.exceptions.InvalidValueException;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.math.BigDecimal;
import java.util.Objects;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
public class ItemPedido {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private Integer quantidade;

    @Column
    private BigDecimal precoUnitario;

    @ManyToOne
    @Cascade(CascadeType.MERGE)
    @JsonBackReference
    @JoinColumn(name="pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne
    @Cascade(CascadeType.MERGE)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    public ItemPedido(int quantidade, Produto produto, Pedido pedido) {
        Objects.requireNonNull(pedido, "Pedido é obrigatório");
        this.pedido = pedido;
        Objects.requireNonNull(produto, "Produto é obrigatório");
        this.produto = produto;

        this.precoUnitario = BigDecimal.valueOf(produto.getPreco());
        setQuantidade(quantidade);
    }

    ItemPedido(long id, int quantidade, Produto produto, Pedido pedido) {
        this.id = id;
        Objects.requireNonNull(pedido, "Pedido é obrigatório");
        this.pedido = pedido;
        Objects.requireNonNull(produto, "Produto é obrigatório");
        this.produto = produto;

        this.precoUnitario = BigDecimal.valueOf(produto.getPreco());
        setQuantidade(quantidade);
    }

    public void setQuantidade(int quantidade) {
        if(quantidade < 0)
            throw new InvalidValueException("Quantidade deve ser um valor positivo");

        this.quantidade = quantidade;
    }

    public BigDecimal calcularSubtotal() {
        return BigDecimal.valueOf(this.getQuantidade() * this.getProduto().getPreco());
    }
}
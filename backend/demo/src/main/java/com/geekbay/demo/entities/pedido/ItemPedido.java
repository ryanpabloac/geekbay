package com.geekbay.demo.entities.pedido;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.util.Objects;

@Getter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;
    private Integer quantidade;

    @ManyToOne
    @JoinColumn(name="pedido_id")
    private Pedido pedido;

    //private Produto produto;
    protected ItemPedido() {}
    public ItemPedido(int quantidade, Pedido pedido) {
        Objects.requireNonNull(pedido, "Pedido é obrigatório");
        adicionarQuantidade(quantidade);
    }
    ItemPedido(long id, int quantidade, Pedido pedido) {
        this.id = id;
        Objects.requireNonNull(pedido, "Pedido é obrigatório");
        adicionarQuantidade(quantidade);
    }

    void adicionarQuantidade(int quantidade) {
        if(quantidade < 0)
            throw new IllegalArgumentException("A quantidade a adicionar deve ser um número positivo");

        this.quantidade += quantidade;
    }
    void removerQuantidade(int quantidade) {
        if (quantidade < 0)
            throw new IllegalArgumentException("A quantidade a remover deve ser um número positivo");

        this.quantidade -= quantidade;
    }
}
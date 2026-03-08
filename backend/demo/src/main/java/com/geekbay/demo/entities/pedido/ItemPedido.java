package com.geekbay.demo.entities.pedido;

import com.geekbay.demo.entities.produto.Produto;
import com.geekbay.demo.exceptions.InvalidValueException;
import jakarta.persistence.*;
import lombok.*;

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

    @ManyToOne
    @JoinColumn(name="pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    public ItemPedido(int quantidade, Produto produto, Pedido pedido) {
        Objects.requireNonNull(pedido, "Pedido é obrigatório");
        Objects.requireNonNull(produto, "Produto é obrigatório");
        setQuantidade(quantidade);
    }

    ItemPedido(long id, int quantidade, Produto produto, Pedido pedido) {
        this.id = id;
        Objects.requireNonNull(pedido, "Pedido é obrigatório");
        Objects.requireNonNull(produto, "Produto é obrigatório");
        setQuantidade(quantidade);
    }

    public void setQuantidade(int quantidade) {
        if(quantidade < 0)
            throw new InvalidValueException("Quantidade deve ser um valor positivo");

        this.quantidade = quantidade;
    }
}
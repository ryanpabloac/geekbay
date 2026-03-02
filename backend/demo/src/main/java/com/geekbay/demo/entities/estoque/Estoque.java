package com.geekbay.demo.entities.estoque;


import com.geekbay.demo.dtos.estoque.EstoqueRequestDTO;
import com.geekbay.demo.dtos.produto.ProdutoResponseDTO;
import com.geekbay.demo.entities.produto.Produto;
import jakarta.persistence.*;

@Entity(name = "estoque")
@Table(name = "estoque")
public class Estoque {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "estoque_seq")
    @SequenceGenerator(name = "estoque_seq", sequenceName = "estoque_seq",  allocationSize = 1)
    private Integer id;
    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;
    //@Column(name = "produtoId", nullable = false, unique = true)
    //private Integer produtoId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id")
    private Produto produto;

    public Estoque(){}
    public Estoque(Integer quantidade, Produto produto){
        this.quantidade = quantidade;
        this.produto = produto;
    }
    public Estoque(EstoqueRequestDTO estoqueRequestDTO){
        this.quantidade = estoqueRequestDTO.quantidade();
    }


    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}

    public Integer getQuantidade() {return quantidade;}
    public void setQuantidade(Integer quantidade) {this.quantidade = quantidade;}

    public Produto getProduto() {return produto;}
    public void setProduto(Produto produto) {this.produto = produto;}

    public ProdutoResponseDTO converteParaDto(Produto produto){
        return new ProdutoResponseDTO(produto);
    }
}

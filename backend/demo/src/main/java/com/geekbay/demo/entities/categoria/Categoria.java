package com.geekbay.demo.entities.categoria;


import com.geekbay.demo.dtos.categoria.CategoriaRequestDTO;
import com.geekbay.demo.entities.produto.Produto;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity(name = "categoria")
@Table(name = "categoria")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "categoria_seq")
    @SequenceGenerator(name = "categoria_seq", sequenceName = "categoria_seq", allocationSize = 1)
    private Integer id;
    @Column(name = "nome", nullable = false, unique = true) // Coloquei unique pra poder filtrar por nome corretamente
    private String nome;
    @Column(name = "descricao")
    private String descricao;

    @OneToMany(
            mappedBy = "categoria",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Produto> produtosRegistrados = new ArrayList<>();

    public Categoria(){}

    public Categoria(Integer id, String nome, String descricao){
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }

    public Categoria(CategoriaRequestDTO categoriaRequestDTO){
        this.nome = categoriaRequestDTO.nome();
        this.descricao = categoriaRequestDTO.descricao();
    }

    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}

    public String getNome() {return nome;}
    public void setNome(String nome) {this.nome = nome;}

    public String getDescricao() {return descricao;}
    public void setDescricao(String descricao) {this.descricao = descricao;}

    public List<Produto> getProdutosRegistrados() {return produtosRegistrados;}
    public void setProdutosRegistrados(List<Produto> produtosRegistrados) {this.produtosRegistrados = produtosRegistrados;}

}

package com.geekbay.demo.entities.produto;

import com.geekbay.demo.dtos.categoria.CategoriaResponseDTO;
import com.geekbay.demo.dtos.produto.ProdutoRequestDTO;
import com.geekbay.demo.entities.categoria.Categoria;
import com.geekbay.demo.entities.estoque.Estoque;
import jakarta.persistence.*;

import java.util.Objects;

@Entity(name = "produto")
@Table(name = "produto")
public class Produto {
    @Id
    // Estudar SEQUENCE X IDENTITY
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "produto_seq")
    @SequenceGenerator(name = "produto_seq", sequenceName = "produto_seq", allocationSize = 1)
    private Integer id;
    @Column(name = "nome", nullable = false, unique = true) // Coloquei unique pra filtrar por nome corretamente
    private String nome;
    @Column(name = "descricao")
    private String descricao;
    @Column(name = "preco", nullable = false)
    private Double preco;
    @Column(name = "imagem")
    private String imagem;
    //@Column(name = "categoria_id", nullable = false)
    //private Integer categoria_id;                           // Adicionar esse como FK (Foreign Key)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @Column(name = "ativo")
    private Boolean ativo;

    @OneToOne(mappedBy = "produto",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private Estoque estoque;

    public Produto(){}

    public Produto(int id, String nome, String descricao, Double preco, String imagem, Boolean ativo, Categoria categoria){
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.imagem = imagem;
        //this.categoria_id = categoria_id;
        this.ativo = ativo;
        this.categoria = categoria;
    }

    public Produto(ProdutoRequestDTO produtoRequestDTO){
        this.nome = produtoRequestDTO.nome();
        this.descricao = produtoRequestDTO.descricao();
        this.preco = produtoRequestDTO.preco();
        this.imagem = produtoRequestDTO.imagem();
        //this.categoria_id = produtoRequestDTO.categoria_id();
        this.ativo = produtoRequestDTO.ativo();
    }

    public int getId() {return id;}
    public void setId(int id) {this.id = id;}

    public String getNome() {return nome;}
    public void setNome(String nome) {this.nome = nome;}

    public String getDescricao() {return descricao;}
    public void setDescricao(String descricao) {this.descricao = descricao;}

    public Double getPreco() {return preco;}
    public void setPreco(Double preco) {this.preco = preco;}

    public String getImagem() {return imagem;}
    public void setImagem(String imagem) {this.imagem = imagem;}

    //public Integer getCategoria_id() {return categoria_id;}
    //public void setCategoria_id(Integer categoria_id) {this.categoria_id = categoria_id;}

    public Boolean isAtivo() {return ativo;}
    public void setAtivo(Boolean ativo) {this.ativo = ativo;}

    public Categoria getCategoria() {return categoria;}
    public void setCategoria(Categoria categoria) {this.categoria = categoria;}

    public CategoriaResponseDTO converteParaDto(Categoria categoria){
        return new CategoriaResponseDTO(categoria);
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Produto produto)) return false;
        return Objects.equals(id, produto.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Produto{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", descricao='" + descricao + '\'' +
                ", preco=" + preco +
                ", imagem='" + imagem + '\'' +
                ", categoria=" + categoria +
                ", ativo=" + ativo +
                '}';
    }
}

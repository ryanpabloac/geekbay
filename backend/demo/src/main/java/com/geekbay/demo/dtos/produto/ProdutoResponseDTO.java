package com.geekbay.demo.dtos.produto;

import com.geekbay.demo.dtos.categoria.CategoriaResponseDTO;
import com.geekbay.demo.entities.produto.Produto;

public record ProdutoResponseDTO(
        int id,
        String nome,
        String descricao,
        Double preco,
        String imagem,
        //Categoria categoria,
        CategoriaResponseDTO categoriaResponseDTO,
        Boolean ativo
) {
    public ProdutoResponseDTO(Produto produto){
        this(produto.getId(), produto.getNome(), produto.getDescricao(), produto.getPreco(), produto.getImagem(), produto.converteParaDto(produto.getCategoria()), produto.isAtivo());
    }
}

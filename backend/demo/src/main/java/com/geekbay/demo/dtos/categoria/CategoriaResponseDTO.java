package com.geekbay.demo.dtos.categoria;

import com.geekbay.demo.entities.categoria.Categoria;

public record CategoriaResponseDTO(
        Integer id,
        String nome,
        String descricao
){
    public CategoriaResponseDTO(Categoria categoria){
        this(categoria.getId(), categoria.getNome(), categoria.getDescricao());
    }
}

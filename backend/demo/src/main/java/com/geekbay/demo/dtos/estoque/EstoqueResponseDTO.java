package com.geekbay.demo.dtos.estoque;

import com.geekbay.demo.dtos.produto.ProdutoResponseDTO;
import com.geekbay.demo.entities.estoque.Estoque;

public record EstoqueResponseDTO(
        Integer quantidade,
        ProdutoResponseDTO produtoResponseDTO
){
    public EstoqueResponseDTO(Estoque estoque){
        this(estoque.getQuantidade(), estoque.converteParaDto(estoque.getProduto()));
    }
}

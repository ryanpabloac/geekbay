package com.geekbay.demo.dtos.produto;

public record ProdutoUpdateRequestDTO(
        String nome,
        String descricao,
        Double preco,
        String imagem,
        Integer categoria_id,
        Boolean ativo
) {}

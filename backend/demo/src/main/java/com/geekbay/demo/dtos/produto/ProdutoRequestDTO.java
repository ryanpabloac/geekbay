package com.geekbay.demo.dtos.produto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProdutoRequestDTO(
        @NotBlank
        String nome,
        String descricao,
        @NotNull
        Double preco,
        String imagem,
        @NotNull
        Integer categoria_id,
        Boolean ativo
) {}

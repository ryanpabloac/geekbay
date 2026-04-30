package com.geekbay.demo.dtos.produto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

public record ProdutoRequestDTO(
        @NotBlank
        String nome,
        String descricao,
        @NotNull
        Double preco,
        //MultipartFile imagem,
        @NotNull
        Integer categoria_id,
        Boolean ativo
) {}

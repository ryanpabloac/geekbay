package com.geekbay.demo.dtos.produto;

import org.springframework.web.multipart.MultipartFile;

public record ProdutoUpdateRequestDTO(
        String nome,
        String descricao,
        Double preco,
        MultipartFile imagem,
        Integer categoria_id,
        Boolean ativo
) {}

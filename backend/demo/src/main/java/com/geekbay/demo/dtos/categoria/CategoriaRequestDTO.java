package com.geekbay.demo.dtos.categoria;

import jakarta.validation.constraints.NotBlank;

public record CategoriaRequestDTO(
        @NotBlank
        String nome,
        String descricao
) {}

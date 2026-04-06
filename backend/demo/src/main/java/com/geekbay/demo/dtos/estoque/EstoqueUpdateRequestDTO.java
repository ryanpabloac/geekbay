package com.geekbay.demo.dtos.estoque;

import jakarta.validation.constraints.NotNull;

public record EstoqueUpdateRequestDTO(
        @NotNull
        Integer quantidade
) {}

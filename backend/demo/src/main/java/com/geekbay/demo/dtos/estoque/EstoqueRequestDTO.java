package com.geekbay.demo.dtos.estoque;

import jakarta.validation.constraints.NotNull;

public record EstoqueRequestDTO(
        @NotNull
        Integer quantidade,
        @NotNull
        Integer produto_id
){
}

package com.geekbay.demo.dtos.endereco;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EnderecoRequestDTO(
        @NotBlank
        String cep,

        @NotBlank
        String number,

        String complement,

        @NotNull
        Long usuarioId
) {}

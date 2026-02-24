package com.geekbay.demo.dtos.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UsuarioRequestDTO(
        @NotBlank(message = "O nome é obrigatório.")
        String nome,
        @NotBlank(message = "O CPF é obrigatório.")
        String cpf,
        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "O e-mail informado é inválido.")
        String email,
        @NotBlank(message = "O telefone é obrigatório.")
        String telefone,
        @NotBlank(message = "A senha é obrigatória.")
        String senha
) {
}
package com.geekbay.demo.dtos.usuario;

import com.geekbay.demo.enums.Profile;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String cpf,
        String email,
        String telefone,
        Profile perfil
) {}

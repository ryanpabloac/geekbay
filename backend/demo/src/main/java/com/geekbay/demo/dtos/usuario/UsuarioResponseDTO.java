package com.geekbay.demo.dtos.usuario;

import com.geekbay.demo.enums.Profile;

public record UsuarioResponseDTO(
        Long id,
        String name,
        String cpf,
        String email,
        String phone,
        Profile profile
) {}

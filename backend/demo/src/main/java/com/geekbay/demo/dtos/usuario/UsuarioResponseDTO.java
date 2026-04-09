package com.geekbay.demo.dtos.usuario;

import com.geekbay.demo.entities.usuario.Usuario;
import com.geekbay.demo.enums.Profile;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String cpf,
        String email,
        String telefone,
        Profile perfil
) {
    public UsuarioResponseDTO(Usuario usuario){
        this(usuario.getId(), usuario.getNome(), usuario.getCpf(), usuario.getEmail(), usuario.getTelefone(), usuario.getPerfil());
    }
}

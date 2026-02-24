package com.geekbay.demo.controller;

import com.geekbay.demo.enums.Profile;
import com.geekbay.demo.dtos.usuario.UsuarioRequestDTO;
import com.geekbay.demo.dtos.usuario.UsuarioResponseDTO;
import com.geekbay.demo.entities.Usuario;
import com.geekbay.demo.services.UsuarioService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> createUser(@Valid @RequestBody final UsuarioRequestDTO dto) {
        final Usuario usuario = usuarioService.createUser(
                Usuario.builder()
                        .nome(dto.nome())
                        .cpf(dto.cpf())
                        .email(dto.email())
                        .telefone(dto.telefone())
                        .perfil(Profile.CLIENTE)
                        // por enquanto em texto (depois a gente coloca BCrypt)
                        .senha(dto.senha())
                        .build()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new UsuarioResponseDTO(
                        usuario.getId(),
                        usuario.getNome(),
                        usuario.getCpf(),
                        usuario.getEmail(),
                        usuario.getTelefone(),
                        usuario.getPerfil()
                )
        );
    }
}

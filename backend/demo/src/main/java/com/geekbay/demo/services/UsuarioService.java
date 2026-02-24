package com.geekbay.demo.services;

import com.geekbay.demo.entities.Usuario;
import com.geekbay.demo.repositories.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;

    public Usuario createUser(final Usuario usuario) {
        return repository.save(usuario);
    }
}

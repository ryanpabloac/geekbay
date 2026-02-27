package com.geekbay.demo.services;

import com.geekbay.demo.entities.Usuario;
import com.geekbay.demo.exceptions.AlreadyExistsException;
import com.geekbay.demo.repositories.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UsuarioService {

    private final UsuarioRepository userRepository;

    public Usuario createUser(final Usuario usuario) {
        if (userRepository.existsByCpf(usuario.getCpf())) {
            throw new AlreadyExistsException(String.format("CPF %s já cadastrado.", usuario.getCpf()));
        }

        if (userRepository.existsByEmail(usuario.getEmail())) {
            throw new AlreadyExistsException(String.format("E-mail %s já cadastrado.", usuario.getEmail()));
        }

        return userRepository.save(usuario);
    }
}

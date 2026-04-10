package com.geekbay.demo.services;

import com.geekbay.demo.dtos.usuario.UsuarioResponseDTO;
import com.geekbay.demo.entities.usuario.Usuario;
import com.geekbay.demo.exceptions.AlreadyExistsException;
import com.geekbay.demo.exceptions.NotFoundException;
import com.geekbay.demo.repositories.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UsuarioService {

    private final UsuarioRepository userRepository;
    private final PasswordEncoder passwordEncoder;



    public Usuario createUser(final Usuario usuario) {
        if (userRepository.existsByCpf(usuario.getCpf())) {
            throw new AlreadyExistsException(String.format("CPF %s já cadastrado.", usuario.getCpf()));
        }

        if (userRepository.existsByEmail(usuario.getEmail())) {
            throw new AlreadyExistsException(String.format("E-mail %s já cadastrado.", usuario.getEmail()));
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        return userRepository.save(usuario);
    }

    public UsuarioResponseDTO getUser(Long usuarioId) {
        Optional<Usuario> user = userRepository.findById(usuarioId);
        if(user.isEmpty()) throw new NotFoundException("Usuário não encontrado");
        return new UsuarioResponseDTO(user.get());
    }
    public Usuario getUserEntity(final Long usuarioId) {
        Optional<Usuario> user = userRepository.findById(usuarioId);
        if(user.isEmpty()) throw new NotFoundException("Usuário não encontrado");
        return user.get();
    }


    public List<UsuarioResponseDTO> getUsersList(){
        return this.userRepository.findAll(Sort.by("id").ascending())
                .stream()
                .map(usuario -> new UsuarioResponseDTO(usuario))
                .toList();
    }


}

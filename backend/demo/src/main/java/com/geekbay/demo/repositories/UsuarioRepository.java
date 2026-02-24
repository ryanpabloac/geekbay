package com.geekbay.demo.repositories;

import com.geekbay.demo.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UsuarioRepository extends JpaRepository <Usuario, Long> {
}

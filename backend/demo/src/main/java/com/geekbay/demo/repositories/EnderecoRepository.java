package com.geekbay.demo.repositories;

import com.geekbay.demo.entities.endereco.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Integer> {
    Endereco findByUsuarioId(Integer usuarioId);
    Endereco findByCep(String cep);
}

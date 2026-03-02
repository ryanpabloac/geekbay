package com.geekbay.demo.repositories;

import com.geekbay.demo.entities.estoque.Estoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstoqueRepository extends JpaRepository<Estoque, Integer> {
    Estoque findByProdutoId(Integer produtoId);
}

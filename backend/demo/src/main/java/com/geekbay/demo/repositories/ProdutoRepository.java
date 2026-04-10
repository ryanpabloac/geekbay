package com.geekbay.demo.repositories;

import com.geekbay.demo.entities.produto.Produto;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
    // Case sensitive -> Necessário consertar
    Produto findByNome(String nome);
    List<Produto> findByCategoriaId(Integer categoriaId, Sort sort);
}

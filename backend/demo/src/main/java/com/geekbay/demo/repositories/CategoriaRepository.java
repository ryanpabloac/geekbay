package com.geekbay.demo.repositories;

import com.geekbay.demo.entities.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository <Categoria, Long>{
}

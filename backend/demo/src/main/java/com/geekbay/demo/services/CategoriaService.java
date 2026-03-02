package com.geekbay.demo.services;

import com.geekbay.demo.entities.Categoria;
import com.geekbay.demo.repositories.CategoriaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoriaService {

    private final CategoriaRepository repository;

    public List<Categoria> findAll() {
        return repository.findAll();
    }
}

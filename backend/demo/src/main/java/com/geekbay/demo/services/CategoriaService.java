package com.geekbay.demo.services;

import com.geekbay.demo.dtos.categoria.CategoriaResponseDTO;
import com.geekbay.demo.entities.Categoria;
import com.geekbay.demo.repositories.CategoriaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoriaService {

    private final CategoriaRepository repository;

    public List<CategoriaResponseDTO> findAll() {
        List<Categoria> categorias = repository.findAll();

        return categorias.stream()
                .map(categoria -> new CategoriaResponseDTO(
                        categoria.getId(),
                        categoria.getNome(),
                        categoria.getDescricao()
                ))
                .toList();

    }

    public Categoria findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
    }
}

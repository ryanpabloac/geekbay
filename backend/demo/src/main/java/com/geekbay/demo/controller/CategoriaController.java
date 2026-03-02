package com.geekbay.demo.controller;

import com.geekbay.demo.dtos.categoria.CategoriaResponseDTO;
import com.geekbay.demo.services.CategoriaService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;


    @GetMapping
    public List<CategoriaResponseDTO> getCategories() {
        return categoriaService.findAll()
                .stream()
                .map(categoria -> new CategoriaResponseDTO(
                        categoria.getId(),
                        categoria.getNome(),
                        categoria.getDescricao()
                ))
                .toList();
    }
}


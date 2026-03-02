package com.geekbay.demo.services;

import com.geekbay.demo.repositories.CategoriaRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceTest {

    @Mock
    private CategoriaRepository repository;

    @InjectMocks
    private CategoriaService service;

    @Test
    @DisplayName("Deve retornar lista de categorias quando houver registros")
    void findAll_shouldReturnList() {

        Categoria cat1 = new Categoria(1L, "Skincare", "Produtos de cuidados com a pele");
        Categoria cat2 = new Categoria(2L, "Casa", "Aromas e itens para casa");

        when(repository.findAll()).thenReturn(List.of(cat1, cat2));

        List<Categoria> result = service.findAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Skincare", result.get(0).getNome());
        assertEquals("Casa", result.get(1).getNome());
    }

    @Test
    @DisplayName("Deve retornar lista vazia quando não houver categorias")
    void findAll_shouldReturnEmptyList() {

        when(repository.findAll()).thenReturn(List.of());

        List<Categoria> result = service.findAll();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}
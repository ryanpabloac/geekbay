package com.geekbay.demo.controller;

import com.geekbay.demo.services.CategoriaService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CategoriaController.class)
class CategoriaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CategoriaService categoriaService;

    @Test
    @DisplayName("GET /categorias deve retornar 200 e lista de categorias em JSON")
    void getCategories_shouldReturnList() throws Exception {
        Categoria cat1 = new Categoria(1L, "Skincare", "Produtos de cuidados com a pele");
        Categoria cat2 = new Categoria(2L, "Casa", "Aromas e itens para casa");

        when(categoriaService.findAll()).thenReturn(List.of(cat1, cat2));

        mockMvc.perform(get("/categorias").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].nome").value("Skincare"))
                .andExpect(jsonPath("$[0].descricao").value("Produtos de cuidados com a pele"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].nome").value("Casa"))
                .andExpect(jsonPath("$[1].descricao").value("Aromas e itens para casa"));
    }

    @Test
    @DisplayName("GET /categorias deve retornar 200 e lista vazia quando não houver categorias")
    void getCategories_shouldReturnEmptyList() throws Exception {
        when(categoriaService.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/categorias").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(0));
    }
}
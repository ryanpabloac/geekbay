package com.geekbay.demo.controller;


import com.geekbay.demo.dtos.categoria.CategoriaRequestDTO;
import com.geekbay.demo.dtos.categoria.CategoriaResponseDTO;
import com.geekbay.demo.entities.categoria.Categoria;
import com.geekbay.demo.services.CategoriaService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/categoria")
public class CategoriaController {

    private final CategoriaService categoriaService;

    // GET

    @GetMapping()
    public ResponseEntity<List<CategoriaResponseDTO>> getCategoriaList(){
        return ResponseEntity.ok(this.categoriaService.getCategoriaList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponseDTO> getCategoriaById(@PathVariable Integer id){
        try{
            return ResponseEntity.ok(this.categoriaService.getCategoriaById(id));
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/nome/{nome}")
    public ResponseEntity<CategoriaResponseDTO> getCategoriaByNome(@PathVariable String nome){
        try{
            return ResponseEntity.ok(this.categoriaService.getCategoriaByNome(nome));
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    // POST

    @PostMapping()
    public ResponseEntity addNewCategoria(@RequestBody CategoriaRequestDTO categoriaRequestDTO){
        try{
            this.categoriaService.addNewCategoria(categoriaRequestDTO);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }

    }

    // PUT

    @PutMapping("/{id}")
    public ResponseEntity updateCategoriaById(@PathVariable Integer id, @RequestBody CategoriaRequestDTO categoriaRequestDTO){
        try{
            this.categoriaService.updateCategoriaById(id, categoriaRequestDTO);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/nome/{nome}")
    public ResponseEntity updateCategoriaByNome(@PathVariable String nome, @RequestBody CategoriaRequestDTO categoriaRequestDTO){
        try{
            this.categoriaService.updateCategoriaByNome(nome, categoriaRequestDTO);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // DELETE

    @DeleteMapping("/{id}")
    public ResponseEntity deleteCategoriaById(@PathVariable Integer id){
        try{
            this.categoriaService.deleteCategoriaById(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/nome/{nome}")
    public ResponseEntity deleteCategoriaByNome(@PathVariable String nome){
        try{
            this.categoriaService.deleteCategoriaByNome(nome);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

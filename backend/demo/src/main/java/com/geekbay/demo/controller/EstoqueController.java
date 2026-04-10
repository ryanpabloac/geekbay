package com.geekbay.demo.controller;

import com.geekbay.demo.dtos.estoque.EstoqueRequestDTO;
import com.geekbay.demo.dtos.estoque.EstoqueResponseDTO;
import com.geekbay.demo.services.EstoqueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estoque")
public class EstoqueController {
    private final EstoqueService estoqueService;

    public EstoqueController(EstoqueService estoqueService){
        this.estoqueService = estoqueService;
    }

    // GET
    @GetMapping()
    public ResponseEntity<List<EstoqueResponseDTO>> getEstoqueList(){
        return ResponseEntity.ok(this.estoqueService.getEstoqueList());
    }
    @GetMapping("/produto/{id}")
    public ResponseEntity<EstoqueResponseDTO> getEstoqueByProdutoId(@PathVariable Integer id){
        try{
            return ResponseEntity.ok(this.estoqueService.getEstoqueByProdutoId(id));
        }catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // POST
    @PostMapping()
    public ResponseEntity addNewProdutoInEstoque(@RequestBody EstoqueRequestDTO estoqueRequestDTO){
        try{
            this.estoqueService.addNewProdutoInEstoque(estoqueRequestDTO);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // PUT
    @PutMapping("/produto/{id}")
    public ResponseEntity updateQuantidadeByProdutoId(@PathVariable Integer id, @RequestBody EstoqueRequestDTO estoqueRequestDTO){
        try{
            this.estoqueService.updateQuantidadeByProdutoId(id, estoqueRequestDTO);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

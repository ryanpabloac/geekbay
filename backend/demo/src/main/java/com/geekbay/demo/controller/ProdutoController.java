package com.geekbay.demo.controller;


import com.geekbay.demo.dtos.produto.ProdutoRequestDTO;
import com.geekbay.demo.dtos.produto.ProdutoResponseDTO;
import com.geekbay.demo.services.ProdutoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produto") // Consertar aqui -> Colocar /produto e retirar dos endpoints
public class ProdutoController {
    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService){
        this.produtoService = produtoService;
    }

    // Criar BAD REQUEST BODY nos GET que retornam entidades
    // Consertar updateProdutoById -> sempre retorna 200 mesmo com ID inválido
    // Consertar updateProdutoByNome -> sempre retorna 200 mesmo com ID inválido
    // Consertar deleteProdutoById -> sempre retorna 200 mesmo com ID inválido


    // GET

    @GetMapping()
    public ResponseEntity<List<ProdutoResponseDTO>> getProdutoList(){
        return ResponseEntity.ok(this.produtoService.getProdutoList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> getProdutoById(@PathVariable int id){
        return ResponseEntity.ok(this.produtoService.getProdutoById(id));
    }

    @GetMapping("/nome/{nome}")
    public ResponseEntity<ProdutoResponseDTO> getProdutoByNome(@PathVariable String nome){
        return ResponseEntity.ok(this.produtoService.getProdutoByNome(nome));
    }

    @GetMapping("/categoria/{categoria_id}")
    public ResponseEntity<List<ProdutoResponseDTO>> getProdutoListByCategoria(@PathVariable Integer categoria_id){
        return ResponseEntity.ok(this.produtoService.getProdutoListByCategoria(categoria_id));
    }


    // POST

    @PostMapping()
    public ResponseEntity addNewProduto(@RequestBody ProdutoRequestDTO produtoRequestDTO){
        this.produtoService.addNewProduto(produtoRequestDTO);
        return ResponseEntity.ok().build();
    }


    // PUT
    @PutMapping("/{id}")
    public ResponseEntity updateProdutoById(@PathVariable int id, @RequestBody ProdutoRequestDTO produtoRequestDTO){
        try{
            this.produtoService.updateProdutoById(id, produtoRequestDTO);
            return ResponseEntity.ok().build();
        }
        catch (RuntimeException idInvalido){
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/nome/{nome}")
    public ResponseEntity updateProdutoByNome(@PathVariable String nome, @RequestBody ProdutoRequestDTO produtoRequestDTO){
        try{
            this.produtoService.updateProdutoByNome(nome, produtoRequestDTO);
            return ResponseEntity.ok().build();
        }
        catch (RuntimeException idInvalido){
            return ResponseEntity.badRequest().build();
        }
    }


    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity deleteProdutoById(@PathVariable int id){
        try{
            this.produtoService.deleteProdutoById(id);
            return ResponseEntity.ok().build();
        }
        catch (RuntimeException idInvalido){
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/nome/{nome}")
    public ResponseEntity deleteProdutoByNome(@PathVariable String nome){
        this.produtoService.deleteProdutoByNome(nome);
        return ResponseEntity.ok().build();
    }
}

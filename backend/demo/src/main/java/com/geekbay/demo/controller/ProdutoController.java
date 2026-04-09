package com.geekbay.demo.controller;


import com.geekbay.demo.dtos.produto.ProdutoRequestDTO;
import com.geekbay.demo.dtos.produto.ProdutoResponseDTO;
import com.geekbay.demo.dtos.produto.ProdutoUpdateRequestDTO;
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



    // GET

    @GetMapping()
    public ResponseEntity<List<ProdutoResponseDTO>> getProdutoList(){
        return ResponseEntity.ok(this.produtoService.getProdutoList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> getProdutoById(@PathVariable Integer id){
        try{
            return ResponseEntity.ok(this.produtoService.getProdutoById(id));
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/nome/{nome}")
    public ResponseEntity<ProdutoResponseDTO> getProdutoByNome(@PathVariable String nome){
        try{
            return ResponseEntity.ok(this.produtoService.getProdutoByNome(nome));
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/categoria/{categoria_id}")
    public ResponseEntity<List<ProdutoResponseDTO>> getProdutoListByCategoria(@PathVariable Integer categoria_id){
        try{
            return ResponseEntity.ok(this.produtoService.getProdutoListByCategoria(categoria_id));
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }


    // POST

    @PostMapping()
    public ResponseEntity addNewProduto(@RequestBody ProdutoRequestDTO produtoRequestDTO){
        try{
            this.produtoService.addNewProduto(produtoRequestDTO);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }


    // PUT
    @PutMapping("/{id}")
    public ResponseEntity updateProdutoById(@PathVariable Integer id, @RequestBody ProdutoUpdateRequestDTO produtoRequestDTO){
        try{
            this.produtoService.updateProdutoById(id, produtoRequestDTO);
            return ResponseEntity.ok().build();
        }
        catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/nome/{nome}")
    public ResponseEntity updateProdutoByNome(@PathVariable String nome, @RequestBody ProdutoUpdateRequestDTO produtoRequestDTO){
        try{
            this.produtoService.updateProdutoByNome(nome, produtoRequestDTO);
            return ResponseEntity.ok().build();
        }
        catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }


    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity deleteProdutoById(@PathVariable Integer id){
        try{
            this.produtoService.deleteProdutoById(id);
            return ResponseEntity.ok().build();
        }
        catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/nome/{nome}")
    public ResponseEntity deleteProdutoByNome(@PathVariable String nome){
        try{
            this.produtoService.deleteProdutoByNome(nome);
            return ResponseEntity.ok().build();
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }

    }
}

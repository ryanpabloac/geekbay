package com.geekbay.demo.controller;


import com.geekbay.demo.dtos.produto.ProdutoRequestDTO;
import com.geekbay.demo.dtos.produto.ProdutoResponseDTO;
import com.geekbay.demo.dtos.produto.ProdutoUpdateRequestDTO;
import com.geekbay.demo.services.ProdutoService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity addNewProduto(@RequestPart("image") MultipartFile image, @RequestPart("data") ProdutoRequestDTO produtoRequestDTO){
        try{
            this.produtoService.addNewProduto(produtoRequestDTO);   // Corrigir aqui para mandar a image pra função de processamento
            return ResponseEntity.ok().build();
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        } catch (IOException e){
            return ResponseEntity.badRequest().body("Erro no envio da imagem do produto como arquivo");
        }
    }


    // PUT
    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity updateProdutoById(@PathVariable Integer id, @RequestPart("image") MultipartFile image, @RequestPart("data") ProdutoUpdateRequestDTO produtoRequestDTO){
        try{
            this.produtoService.updateProdutoById(id, produtoRequestDTO); // Corrigir aqui para mandar a image pra função de processamento
            return ResponseEntity.ok().build();
        }
        catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
        catch (IOException e){
            return ResponseEntity.badRequest().body("Erro no envio da imagem do produto como arquivo");
        }
    }

    @PutMapping(value = "/nome/{nome}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity updateProdutoByNome(@PathVariable String nome, @RequestPart("image") MultipartFile image, @RequestPart("data") ProdutoUpdateRequestDTO produtoRequestDTO){
        try{
            this.produtoService.updateProdutoByNome(nome, produtoRequestDTO); // Corrigir aqui para mandar a image pra função de processamento
            return ResponseEntity.ok().build();
        }
        catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
        catch (IOException e){
            return ResponseEntity.badRequest().body("Erro no envio da imagem do produto como arquivo");
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

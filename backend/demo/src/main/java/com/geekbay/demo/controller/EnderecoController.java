package com.geekbay.demo.controller;

import com.geekbay.demo.dtos.endereco.EnderecoRequestDTO;
import com.geekbay.demo.dtos.endereco.EnderecoResponseDTO;
import com.geekbay.demo.services.EnderecoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enderecos")
public class EnderecoController {
    private final EnderecoService enderecoService;

    public EnderecoController(EnderecoService enderecoService){
        this.enderecoService = enderecoService;
    }

    @GetMapping("/cep/{cep}")
    public ResponseEntity<EnderecoResponseDTO> getEnderecoByCep(@PathVariable String cep){
        return ResponseEntity.ok(this.enderecoService.getEnderecoByCep(cep));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<EnderecoResponseDTO> getEnderecoByUsuarioId(@PathVariable Long usuarioId){
        return ResponseEntity.ok(this.enderecoService.getEnderecoByUsuarioId(usuarioId));
    }

    @PostMapping()
    public ResponseEntity<Void> addNewEnderecoByCep(@RequestBody EnderecoRequestDTO enderecoRequestDTO){
        this.enderecoService.addNewEnderecoByCep(enderecoRequestDTO);
        return ResponseEntity.ok().build();
    }
}

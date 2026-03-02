package com.geekbay.demo.controller;

import com.geekbay.demo.dtos.endereco.EnderecoRequestDTO;
import com.geekbay.demo.dtos.endereco.EnderecoResponseDTO;
import com.geekbay.demo.services.EnderecoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/endereco")
public class EnderecoController {
    private final EnderecoService enderecoService;

    public EnderecoController(EnderecoService enderecoService){
        this.enderecoService = enderecoService;
    }

    @GetMapping("/cep/{cep}")
    public ResponseEntity<EnderecoResponseDTO> getEnderecoByCep(@PathVariable String cep){
        return ResponseEntity.ok(this.enderecoService.getEnderecoByCep(cep));
    }

    @GetMapping("/usuarioId/{usuarioId}")
    public ResponseEntity<EnderecoResponseDTO> getEnderecoByUsuarioId(@PathVariable Integer usuarioId){
        return ResponseEntity.ok(this.enderecoService.getEnderecoByUsuarioId(usuarioId));
    }

    @PostMapping()
    public ResponseEntity addNewEnderecoByCep(@RequestBody EnderecoRequestDTO enderecoRequestDTO){
        this.enderecoService.addNewEnderecoByCep(enderecoRequestDTO);
        return ResponseEntity.ok().build();
    }
}

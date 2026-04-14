package com.geekbay.demo.controller.pedido;

import
        com.geekbay.demo.dtos.pedido.*;
import com.geekbay.demo.services.CarrinhoService;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/carrinho")
public class CarrinhoController {
    private final CarrinhoService carrinhoService;

    public CarrinhoController(CarrinhoService carrinhoService) {
        this.carrinhoService = carrinhoService;
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<CarrinhoResposeDTO> showCart(@PathVariable Long usuarioId) {
        CarrinhoResposeDTO carrinhoResposeDTO = carrinhoService.getCarrinho(usuarioId);

        return ResponseEntity.ok(carrinhoResposeDTO);
    }

    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Item adicionado ao carrinho com sucesso")
    })
    @PostMapping    // Colocar try-catch pra exceção de ID do produto inexistente - Colocar pra ID do usuário inexistente
    public ResponseEntity<CarrinhoResposeDTO> addNewItemToCart(@RequestBody AdicionarAoCarrinhoDTO body) {
        CarrinhoResposeDTO dto = this.carrinhoService.adicionarAoCarinho(body);

        URI uri = URI.create("api/carrinho/" + body.usuarioId());
        return ResponseEntity.created(uri).build();
    }

    @DeleteMapping
    public ResponseEntity<Object> removeItemFromCart(@RequestBody RemoverItemCarrinhoDTO body) {
        this.carrinhoService.removerDoCarrinho(body);

        return ResponseEntity.ok().build();
    }

    @PatchMapping
    public ResponseEntity<CarrinhoResposeDTO> updateItemQuantity(@RequestBody AtualizarQuantidadeDTO body) {
        CarrinhoResposeDTO response = this.carrinhoService.atualizarQuantidade(body);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/checkout")   // Acho melhor mandar o usuarioId por PathVariable ao invés de requestbody
    public ResponseEntity<PedidoResponseDTO> checkout(@RequestBody CheckoutDTO body) {
        PedidoResponseDTO dto = carrinhoService.checkout(body);

        // Por enquanto, mudar pata create depois que criar listar Pedido
        return ResponseEntity.ok(dto);
    }
}
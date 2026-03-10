package com.geekbay.demo.controller.pedido;

import com.geekbay.demo.dtos.pedido.AdicionarAoCarrinhoDTO;
import com.geekbay.demo.dtos.pedido.CarrinhoResposeDTO;
import com.geekbay.demo.services.CarrinhoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("api/carrinho")
public class CarrinhoController {
    private final CarrinhoService carrinhoService;

    public CarrinhoController(CarrinhoService carrinhoService) {
        this.carrinhoService = carrinhoService;
    }

    @GetMapping("{userId}")
    public ResponseEntity<CarrinhoResposeDTO> showCart(@PathVariable Long userId) {
        CarrinhoResposeDTO carrinhoResposeDTO = carrinhoService.getCarrinho(userId);

        return ResponseEntity.ok(carrinhoResposeDTO);
    }

    @PostMapping
    public ResponseEntity<CarrinhoResposeDTO> addNewItemToCart(@RequestBody AdicionarAoCarrinhoDTO body) {
        CarrinhoResposeDTO dto = this.carrinhoService.adicionarAoCarinho(body);

        URI uri = URI.create("api/carrinho/" + body.usuarioId());
        return ResponseEntity.created(uri).build();
    }
}
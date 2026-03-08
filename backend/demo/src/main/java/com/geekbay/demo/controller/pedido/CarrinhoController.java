package com.geekbay.demo.controller.pedido;

import com.geekbay.demo.dtos.pedido.CarrinhoResposeDTO;
import com.geekbay.demo.services.CarrinhoService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
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
}
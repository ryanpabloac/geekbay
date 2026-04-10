package com.geekbay.demo.controller.pedido;

import com.geekbay.demo.dtos.pedido.ListarPedidosAnterioresRequestDTO;
import com.geekbay.demo.dtos.pedido.ListarPedidosAnterioresResponseDTO;
import com.geekbay.demo.services.PedidoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping("/{usuarioId}")
    public ListarPedidosAnterioresResponseDTO listLastOrders(@PathVariable Long usuarioId) {
        return pedidoService.listLastOrders(usuarioId);
    }
}
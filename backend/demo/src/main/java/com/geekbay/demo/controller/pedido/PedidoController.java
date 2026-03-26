package com.geekbay.demo.controller.pedido;

import com.geekbay.demo.dtos.pedido.CancelarPedidoDTO;
import com.geekbay.demo.dtos.pedido.ListarPedidosAnterioresResponseDTO;
import com.geekbay.demo.dtos.pedido.MudarStatusPedidoDTO;
import com.geekbay.demo.dtos.pedido.PedidoResponseDTO;
import com.geekbay.demo.services.PedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping("{usuarioId}")
    public ListarPedidosAnterioresResponseDTO listLastOrders(@PathVariable Long usuarioId) {
        return pedidoService.listLastOrders(usuarioId);
    }

    @DeleteMapping
    public ResponseEntity<PedidoResponseDTO> cancelOrder(@RequestBody CancelarPedidoDTO body) {
        return ResponseEntity.ok(pedidoService.cancelOrder(body));
    }

    @PatchMapping("/atualizar")
    public void updateStatus(@RequestBody MudarStatusPedidoDTO body) {
        pedidoService.changeOrderStatus(body);
    }
}
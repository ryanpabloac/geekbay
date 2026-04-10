package com.geekbay.demo.controller.pedido;

import com.geekbay.demo.dtos.pedido.CancelarPedidoDTO;
import com.geekbay.demo.dtos.pedido.ListarPedidosAnterioresResponseDTO;
import com.geekbay.demo.dtos.pedido.PedidoRequestDTO;
import com.geekbay.demo.dtos.pedido.PedidoResponseDTO;
import com.geekbay.demo.enums.OrderStatus;
import com.geekbay.demo.exceptions.NotFoundException;
import com.geekbay.demo.exceptions.UnauthorizedOperationException;
import com.geekbay.demo.services.PedidoService;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping("/{usuarioId}") // Lista últimos pedidos by usuarioId
    public ResponseEntity<ListarPedidosAnterioresResponseDTO> listLastOrders(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(pedidoService.listLastOrders(usuarioId));
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponseDTO>> getAllOrdersList(){
        return ResponseEntity.ok(pedidoService.getAllOrdersList());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ListarPedidosAnterioresResponseDTO> getLastOrdersByStatus(@PathVariable String status){
        try{
            return ResponseEntity.ok(pedidoService.getLastOrdersByStatus(status));
        } catch (NotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/atualizar/{id}")   // Atualizar status do pedido -> baseado no ID
    public ResponseEntity updateOrderStatusByPedidoId(@PathVariable Long id, @RequestParam(name = "status") String status){
        try{
            this.pedidoService.updateOrderStatusByPedidoId(id, status);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/cancelar")
    public ResponseEntity cancelOrder(@RequestBody CancelarPedidoDTO request){
        try{
            this.pedidoService.cancelOrder(request);
            return ResponseEntity.ok().build();
        }
        catch(NotFoundException exception){
            return ResponseEntity.notFound().build();
        }
        catch (UnauthorizedOperationException exception){
            return ResponseEntity.status(HttpStatusCode.valueOf(401)).build();
        }
    }



}
package com.geekbay.demo.controller.pedido;

import com.geekbay.demo.dtos.pedido.CancelarPedidoDTO;
import com.geekbay.demo.dtos.pedido.PedidoResponseDTO;
import com.geekbay.demo.exceptions.NotFoundException;
import com.geekbay.demo.exceptions.UnauthorizedOperationException;
import com.geekbay.demo.services.PedidoService;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{usuarioId}") // Lista últimos pedidos by usuarioId
    public ResponseEntity<List<PedidoResponseDTO>> listLastOrders(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(pedidoService.listLastOrders(usuarioId));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<List<PedidoResponseDTO>> getAllOrdersList(){
        return ResponseEntity.ok(pedidoService.getAllOrdersList());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PedidoResponseDTO>> getLastOrdersByStatus(@PathVariable String status){
        try{
            return ResponseEntity.ok(pedidoService.getLastOrdersByStatus(status));
        } catch (NotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/atualizar/{id}")   // Atualizar status do pedido -> baseado no ID
    public ResponseEntity updateOrderStatusByPedidoId(@PathVariable Long id, @RequestParam(name = "status") String status){
        try{
            this.pedidoService.updateOrderStatusByPedidoId(id, status);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("isAuthenticated()")
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
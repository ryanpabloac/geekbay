package com.geekbay.demo.repositories;

import com.geekbay.demo.entities.pedido.Pedido;
import com.geekbay.demo.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido,Long> {
    List<Pedido> findByUsuarioIdAndStatus(Long usuarioId, OrderStatus status);

    @Query("SELECT p FROM Pedido p JOIN FETCH p.itens WHERE p.usuario.id = :usuarioId AND p.status = :status")
    List<Pedido> findByUsuarioIdAndStatusWithItens(@Param("usuarioId") Long usuarioId, @Param("status") OrderStatus status);

    //Pedido findByUsuarioIdAndStatus(Long usuarioId, OrderStatus status);
    List<Pedido> findByUsuarioId(Long usuarioId);
    List<Pedido> findByStatus(OrderStatus status);
}

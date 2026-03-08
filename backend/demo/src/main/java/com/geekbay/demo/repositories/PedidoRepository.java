package com.geekbay.demo.repositories;

import com.geekbay.demo.entities.pedido.Pedido;
import com.geekbay.demo.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido,Long> {
    List<Pedido> findByUsuarioIdAndStatus(Long usuarioId, OrderStatus status);
}

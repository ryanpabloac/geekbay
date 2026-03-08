package com.geekbay.demo.mappers;

import com.geekbay.demo.dtos.pedido.CarrinhoResposeDTO;
import com.geekbay.demo.entities.pedido.Pedido;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class CarrinhoMapper {
    public CarrinhoResposeDTO toResponseDTO(Pedido pedido, BigDecimal valorTotal, BigDecimal valorFrete) {
        return new CarrinhoResposeDTO(pedido, valorTotal, valorFrete);
    }
}

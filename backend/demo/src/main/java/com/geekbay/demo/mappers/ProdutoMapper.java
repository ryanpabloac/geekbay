package com.geekbay.demo.mappers;

import com.geekbay.demo.dtos.pedido.CarrinhoResposeDTO;
import com.geekbay.demo.dtos.produto.ProdutoResponseDTO;
import com.geekbay.demo.entities.categoria.Categoria;
import com.geekbay.demo.entities.pedido.Pedido;
import com.geekbay.demo.entities.produto.Produto;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ProdutoMapper {
    public Produto toEntity(ProdutoResponseDTO produtoResponseDTO) {
        return new Produto(
                produtoResponseDTO.id(),
                produtoResponseDTO.nome(),
                produtoResponseDTO.descricao(),
                produtoResponseDTO.preco(),
                produtoResponseDTO.imagem(),
                produtoResponseDTO.ativo(),
                new Categoria(
                        produtoResponseDTO.categoriaResponseDTO().id(),
                        produtoResponseDTO.nome(),
                        produtoResponseDTO.descricao()
                )
        );
    }
}

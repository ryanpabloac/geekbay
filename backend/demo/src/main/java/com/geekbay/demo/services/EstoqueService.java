package com.geekbay.demo.services;

import com.geekbay.demo.dtos.estoque.EstoqueRequestDTO;
import com.geekbay.demo.dtos.estoque.EstoqueResponseDTO;
import com.geekbay.demo.entities.estoque.Estoque;
import com.geekbay.demo.entities.produto.Produto;
import com.geekbay.demo.exceptions.InsufficientStockException;
import com.geekbay.demo.exceptions.NotFoundException;
import com.geekbay.demo.repositories.EstoqueRepository;
import com.geekbay.demo.repositories.ProdutoRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EstoqueService {
    private final EstoqueRepository estoqueRepository;
    private final ProdutoRepository produtoRepository;

    public EstoqueService(EstoqueRepository estoqueRepository, ProdutoRepository produtoRepository){
        this.estoqueRepository = estoqueRepository;
        this.produtoRepository = produtoRepository;
    }

    // GET
    public List<EstoqueResponseDTO> getEstoqueList(){
        return this.estoqueRepository.findAll(Sort.by("id").ascending()).stream().map(estoque -> new EstoqueResponseDTO(estoque)).toList();
    }

    public EstoqueResponseDTO getEstoqueByProdutoId(Integer id){
        Estoque produtoASerBuscadoNoEstoque = this.estoqueRepository.findByProdutoId(id);
        if(produtoASerBuscadoNoEstoque != null){
            return new EstoqueResponseDTO(produtoASerBuscadoNoEstoque);
        }
        else throw new RuntimeException("Id inválido ou produto inexistente");
    }

    // POST
    public void addNewProdutoInEstoque(EstoqueRequestDTO estoqueRequestDTO){
        Optional<Produto> produtoAdd = this.produtoRepository.findById(estoqueRequestDTO.produto_id());
        if(produtoAdd.isEmpty()) throw new RuntimeException("ID do produto inválido");
        Estoque estoqueAdd = new Estoque();
        estoqueAdd.setQuantidade(estoqueRequestDTO.quantidade());
        estoqueAdd.setProduto(produtoAdd.get());
        this.estoqueRepository.save(estoqueAdd);
    }

    // PUT
    @Transactional
    public void updateQuantidadeByProdutoId(Integer id, EstoqueRequestDTO estoqueRequestDTO){
        Estoque estoqueASerBuscado = this.estoqueRepository.findByProdutoId(id);
        if(estoqueASerBuscado != null){
            estoqueASerBuscado.setQuantidade(estoqueRequestDTO.quantidade());
            estoqueASerBuscado.setProduto(this.produtoRepository.findById(id).get());
        }
        else throw new RuntimeException("ID inválido ou produto inexistente");;
    }

    public void validateDisponibilidade(int produtoId, int quantidade) {
        Estoque estoque = this.estoqueRepository.findByProdutoId(produtoId);

        if(getEstoqueList().isEmpty())
            throw new NotFoundException("Estoque não encontrado");
        if(quantidade > estoque.getQuantidade())
            throw new InsufficientStockException("Estoque insuficiente");
    }
}

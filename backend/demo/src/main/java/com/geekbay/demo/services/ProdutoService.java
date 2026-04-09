package com.geekbay.demo.services;

import com.geekbay.demo.dtos.produto.ProdutoRequestDTO;
import com.geekbay.demo.dtos.produto.ProdutoResponseDTO;
import com.geekbay.demo.dtos.produto.ProdutoUpdateRequestDTO;
import com.geekbay.demo.entities.categoria.Categoria;
import com.geekbay.demo.entities.produto.Produto;
import com.geekbay.demo.repositories.CategoriaRepository;
import com.geekbay.demo.repositories.ProdutoRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {
    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProdutoService(ProdutoRepository produtoRepository, CategoriaRepository categoriaRepository){
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
    }


    // GET

    public List<ProdutoResponseDTO> getProdutoList(){
        return this.produtoRepository
                .findAll(Sort.by("id").ascending())
                .stream()
                .map(p -> new ProdutoResponseDTO(p))
                .toList();
    }

    public ProdutoResponseDTO getProdutoById(Integer id){
        Optional<Produto> produtoQuery = this.produtoRepository.findById(id);
        if(produtoQuery.isEmpty()) throw new RuntimeException("ID inválido ou produto inexistente");
        return produtoQuery.map(produto -> new ProdutoResponseDTO(produto)).get();
    }

    public ProdutoResponseDTO getProdutoByNome(String nome){
        Optional<Produto> produtoBuscado = filtraProdutoExistentePorNome(nome);
        if(produtoBuscado.isEmpty()) throw new RuntimeException("Nome inválido ou produto inexistente");
        return new ProdutoResponseDTO(produtoBuscado.get());
    }

    public List<ProdutoResponseDTO> getProdutoListByCategoria(Integer categoria_id){
        List<Produto> produtoList = this.produtoRepository.findByCategoriaId(categoria_id, Sort.by("id").ascending());
        if(produtoList.isEmpty()) throw new RuntimeException("ID inválido ou categoria inexistente");
        return produtoList.stream().map(produto -> new ProdutoResponseDTO(produto)).toList();
    }


    // POST

    // Colocar ativo=true por default
    public void addNewProduto(ProdutoRequestDTO produtoRequestDTO){
        Optional<Categoria> categoriaAdd = this.categoriaRepository.findById(produtoRequestDTO.categoria_id());
        if(categoriaAdd.isEmpty()) throw new RuntimeException("ID da categoria inválido");
        Produto produtoAdd = new Produto(produtoRequestDTO);
        produtoAdd.setCategoria(categoriaAdd.get());
        this.produtoRepository.save(produtoAdd);
    }


    // PUT

    @Transactional
    public void updateProdutoById(Integer id, ProdutoUpdateRequestDTO produtoRequestDTO){
        Optional<Produto> produtoQuery = this.produtoRepository.findById(id);
        if(produtoQuery.isEmpty()) throw new RuntimeException("ID inválido ou produto inexistente");
        if(produtoRequestDTO.nome() != null) produtoQuery.get().setNome(produtoRequestDTO.nome());
        if(produtoRequestDTO.descricao() != null) produtoQuery.get().setDescricao(produtoRequestDTO.descricao());
        if(produtoRequestDTO.preco() != null) produtoQuery.get().setPreco(produtoRequestDTO.preco());
        if(produtoRequestDTO.imagem() != null) produtoQuery.get().setImagem(produtoRequestDTO.imagem());
        if(produtoRequestDTO.categoria_id() != null) produtoQuery.get()
                .setCategoria(this.categoriaRepository.findById(produtoRequestDTO.categoria_id()).get());
        if(produtoRequestDTO.ativo() != null) produtoQuery.get().setAtivo(produtoRequestDTO.ativo()); // Isso aqui tava dando erro, Boolean pode ser null, já boolean não pode -> Causa NullPointerException no processo de autounboxing

    }

    @Transactional
    public void updateProdutoByNome(String nome, ProdutoUpdateRequestDTO produtoRequestDTO){
        Optional<Produto> produtoQuery = filtraProdutoExistentePorNome(nome);
        if(produtoQuery.isEmpty()) throw new RuntimeException("ID inválido ou produto inexistente");
        if(produtoRequestDTO.nome() != null) produtoQuery.get().setNome(produtoRequestDTO.nome());
        if(produtoRequestDTO.descricao() != null) produtoQuery.get().setDescricao(produtoRequestDTO.descricao());
        if(produtoRequestDTO.preco() != null) produtoQuery.get().setPreco(produtoRequestDTO.preco());
        if(produtoRequestDTO.imagem() != null) produtoQuery.get().setImagem(produtoRequestDTO.imagem());
        if(produtoRequestDTO.categoria_id() != null) produtoQuery.get()
                .setCategoria(this.categoriaRepository.findById(produtoRequestDTO.categoria_id()).get());
        if(produtoRequestDTO.ativo() != null) produtoQuery.get().setAtivo(produtoRequestDTO.ativo()); // Isso aqui tava dando erro, Boolean pode ser null, já boolean não pode -> Causa NullPointerException no processo de autounboxing
    }

    // DELETE

    public void deleteProdutoById(int id){
        if(this.produtoRepository.existsById(id)) this.produtoRepository.deleteById(id);
        else throw new RuntimeException ("ID inválido ou produto inexistente");
    }

    public void deleteProdutoByNome(String nome){
        Optional<Produto> produtoDelete = filtraProdutoExistentePorNome(nome);
        if(produtoDelete.isEmpty()) throw new RuntimeException("Nome inválido ou produto inexistente");
        this.produtoRepository.delete(produtoDelete.get());
    }


    public Optional<Produto> filtraProdutoExistentePorNome(String nome){
        return this.produtoRepository.findAll().stream()
                .filter(produto -> produto.getNome()
                        .replace('á', 'a')
                        .replace('ã','a')
                        .replace('ô','o')
                        .replace('ê', 'e')
                        .replace('ç', 'c')
                        .replace('ó','o')
                        .replace('í','i')
                        .equalsIgnoreCase(nome
                                .replace('á', 'a')
                                .replace('ã','a')
                                .replace('ô','o')
                                .replace('ê', 'e')
                                .replace('ç', 'c')
                                .replace('ó','o')
                                .replace('í','i')
                        )
                )
                .findFirst();
    }
}

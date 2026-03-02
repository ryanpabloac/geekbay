package com.geekbay.demo.services;

import com.geekbay.demo.dtos.produto.ProdutoRequestDTO;
import com.geekbay.demo.dtos.produto.ProdutoResponseDTO;
import com.geekbay.demo.entities.categoria.Categoria;
import com.geekbay.demo.entities.produto.Produto;
import com.geekbay.demo.repositories.CategoriaRepository;
import com.geekbay.demo.repositories.ProdutoRepository;
import org.springframework.stereotype.Service;

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
                .findAll()
                .stream()
                .map(p -> new ProdutoResponseDTO(p))
                .toList();
    }

    public ProdutoResponseDTO getProdutoById(int id){
        if(this.produtoRepository.existsById(id)){
            return this.produtoRepository
                    .findById(id)
                    .map(produto -> new ProdutoResponseDTO(produto))
                    .get();
        }
        throw new RuntimeException("ID inválido ou produto inexistente");
    }

    public ProdutoResponseDTO getProdutoByNome(String nome){
        Optional<Produto> produtoBuscado = filtraProdutoExistentePorNome(nome);
        if(produtoBuscado.isPresent()) return new ProdutoResponseDTO(produtoBuscado.get());
        else throw new RuntimeException("Nome inválido ou produto inexistente");
        /*ProdutoResponseDTO produtoBuscado = this.produtoRepository
                .findAll()
                .stream()
                .filter(produto -> produto.getNome().equalsIgnoreCase(nome))
                .findFirst()
                .map(produto -> new ProdutoResponseDTO(produto))
                .get();
        if(this.produtoRepository.existsById(produtoBuscado.id())){
            return produtoBuscado;
        }
        throw new RuntimeException("Nome inválido ou produto inexistente"); // Não funciona -> Verificar */
    }

    public List<ProdutoResponseDTO> getProdutoListByCategoria(int categoria_id){
        return this.produtoRepository.findByCategoriaId(categoria_id).stream().map(produto -> new ProdutoResponseDTO(produto)).toList();
        /*return this.produtoRepository
                .findAll()
                .stream()
                //.filter(produto -> produto.getCategoria_id() == categoria_id)
                .map(produto -> new ProdutoResponseDTO(produto))
                .toList();*/
    }


    // POST

    // Colocar ativo=true por default
    public void addNewProduto(ProdutoRequestDTO produtoRequestDTO){
        Categoria categoriaAdd = this.categoriaRepository.findById(produtoRequestDTO.categoria_id()).get();
        Produto produtoAdd = new Produto();
        produtoAdd.setNome(produtoRequestDTO.nome());
        produtoAdd.setDescricao(produtoRequestDTO.descricao());
        produtoAdd.setPreco(produtoRequestDTO.preco());
        produtoAdd.setAtivo(produtoRequestDTO.ativo());
        produtoAdd.setImagem(produtoRequestDTO.imagem());
        produtoAdd.setCategoria(categoriaAdd);
        this.produtoRepository.save(produtoAdd);
        //if(this.produtoRepository.findById(produtoRequestDTO.categoria_id()).isPresent()) this.produtoRepository.save(new Produto(produtoRequestDTO));
        //else throw new RuntimeException("ID inválido ou categoria inexistente");
    }


    // PUT

    public void updateProdutoById(int id, ProdutoRequestDTO produtoRequestDTO){
        try{
            if(this.produtoRepository.findById(id).isPresent()){
                Produto produtoUpdate = new Produto(produtoRequestDTO);
                produtoUpdate.setId(id);

                Produto produtoASerAtualizado = this.produtoRepository.findById(id).get();

                if(produtoUpdate.getNome() == null) produtoUpdate.setNome(produtoASerAtualizado.getNome());
                if(produtoUpdate.getDescricao() == null) produtoUpdate.setDescricao(produtoASerAtualizado.getDescricao());
                if(produtoUpdate.getPreco() == null) produtoUpdate.setPreco(produtoASerAtualizado.getPreco());
                if(produtoUpdate.getImagem() == null) produtoUpdate.setImagem(produtoASerAtualizado.getImagem());
                if(produtoUpdate.getCategoria() == null) produtoUpdate.setCategoria(produtoASerAtualizado.getCategoria());
                //if(produtoUpdate.getCategoria_id() == null) produtoUpdate.setCategoria_id(produtoASerAtualizado.getCategoria_id());
                if(produtoUpdate.isAtivo() == null) produtoUpdate.setAtivo(produtoASerAtualizado.isAtivo());

                this.produtoRepository.save(produtoUpdate);
            }
            else
                throw new RuntimeException("ID inválido ou produto inexistente");
        }
        catch (RuntimeException idInvalido){}
    }


    public void updateProdutoByNome(String nome, ProdutoRequestDTO produtoRequestDTO){
        try{
            if(filtraProdutoExistentePorNome(nome).isPresent()){
                Produto produtoUpdate = new Produto(produtoRequestDTO);

                Produto produtoASerAtualizado = filtraProdutoExistentePorNome(nome).get();

                produtoUpdate.setId(produtoASerAtualizado.getId());

                if(produtoUpdate.getNome() == null) produtoUpdate.setNome(produtoASerAtualizado.getNome());
                if(produtoUpdate.getDescricao() == null) produtoUpdate.setDescricao(produtoASerAtualizado.getDescricao());
                if(produtoUpdate.getPreco() == null) produtoUpdate.setPreco(produtoASerAtualizado.getPreco());
                if(produtoUpdate.getImagem() == null) produtoUpdate.setImagem(produtoASerAtualizado.getImagem());
                if(produtoUpdate.getCategoria() == null) produtoUpdate.setCategoria(produtoASerAtualizado.getCategoria());
                //if(produtoUpdate.getCategoria_id() == null) produtoUpdate.setCategoria_id(produtoASerAtualizado.getCategoria_id());
                if(produtoUpdate.isAtivo() == null) produtoUpdate.setAtivo(produtoASerAtualizado.isAtivo());

                this.produtoRepository.save(produtoUpdate);
            }
            else {
                throw new RuntimeException("ID inválido ou produto inexistente");
            }
        }
        catch (RuntimeException idInvalido){}
    }

    // DELETE

    public void deleteProdutoById(int id){
        if(this.produtoRepository.existsById(id)) this.produtoRepository.deleteById(id);
        else throw new RuntimeException ("ID inválido ou produto inexistente");
    }

    public void deleteProdutoByNome(String nome){

        Optional<Produto> produtoDelete = filtraProdutoExistentePorNome(nome);
        if(produtoDelete.isPresent()){
            this.produtoRepository.delete(produtoDelete.get());
        }
        else throw new RuntimeException("Nome inválido ou produto inexistente");

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

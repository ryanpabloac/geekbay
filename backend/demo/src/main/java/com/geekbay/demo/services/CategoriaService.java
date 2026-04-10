package com.geekbay.demo.services;

import com.geekbay.demo.dtos.categoria.CategoriaRequestDTO;
import com.geekbay.demo.dtos.categoria.CategoriaResponseDTO;
import com.geekbay.demo.entities.categoria.Categoria;
import com.geekbay.demo.repositories.CategoriaRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {
    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository){
        this.categoriaRepository = categoriaRepository;
    }

    // GET

    public List<CategoriaResponseDTO> getCategoriaList(){
        return this.categoriaRepository.findAll(Sort.by("id").ascending()).stream().map(categoria -> new CategoriaResponseDTO(categoria)).toList();
    }

    public CategoriaResponseDTO getCategoriaById(Integer id){
        Optional<Categoria> categoriaQuery = this.categoriaRepository.findById(id);
        if(categoriaQuery.isEmpty()) throw new RuntimeException("ID inválido ou categoria inexistente");
        return new CategoriaResponseDTO(categoriaQuery.get());
    }

    public CategoriaResponseDTO getCategoriaByNome(String nome){
        Optional<Categoria> categoriaQuery = filtraCategoriaExistentePorNome(nome);
        if(categoriaQuery.isEmpty()) throw new RuntimeException("Nome inválido ou categoria inexistente");
        return new CategoriaResponseDTO(categoriaQuery.get());
    }

    // POST

    public void addNewCategoria(CategoriaRequestDTO categoriaRequestDTO){
        if(
                filtraCategoriaExistentePorNome(categoriaRequestDTO.nome()).isEmpty()
        ) this.categoriaRepository.save(new Categoria(categoriaRequestDTO));
        else throw new RuntimeException("Categoria já existente");
    }

    // PUT

    @Transactional
    public void updateCategoriaById(Integer id, CategoriaRequestDTO categoriaRequestDTO){
        Optional<Categoria> categoriaQuery = this.categoriaRepository.findById(id);
        if(categoriaQuery.isEmpty()) throw new RuntimeException("ID inválido");
        if(categoriaRequestDTO.nome() != null) categoriaQuery.get().setNome(categoriaRequestDTO.nome());
        if(categoriaRequestDTO.descricao() != null) categoriaQuery.get().setDescricao(categoriaRequestDTO.descricao());
    }

    @Transactional
    public void updateCategoriaByNome(String nome, CategoriaRequestDTO categoriaRequestDTO){
        Optional<Categoria> categoriaQuery = filtraCategoriaExistentePorNome(nome);
        if(categoriaQuery.isEmpty()) throw new RuntimeException("Nome inválido");
        if(categoriaRequestDTO.nome() != null) categoriaQuery.get().setNome(categoriaRequestDTO.nome());
        if(categoriaRequestDTO.descricao() != null) categoriaQuery.get().setDescricao(categoriaRequestDTO.descricao());
    }

    // DELETE

    public void deleteCategoriaById(Integer id){
        if(this.categoriaRepository.existsById(id)) this.categoriaRepository.deleteById(id);
        else throw new RuntimeException("ID inválido ou categoria inexistente");
    }

    public void deleteCategoriaByNome(String nome){
        Optional<Categoria> categoriaDelete = filtraCategoriaExistentePorNome(nome);
        if(categoriaDelete.isEmpty()) throw new RuntimeException("ID inválido ou categoria inexistente");
        this.categoriaRepository.delete(categoriaDelete.get());
    }

    public Optional<Categoria> filtraCategoriaExistentePorNome(String nome){
        return this.categoriaRepository.findAll().stream()
                .filter(categoria -> categoria.getNome()
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
                        ))
                .findFirst();
    }

}

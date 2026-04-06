package com.geekbay.demo.services;

import com.geekbay.demo.dtos.categoria.CategoriaRequestDTO;
import com.geekbay.demo.dtos.categoria.CategoriaResponseDTO;
import com.geekbay.demo.entities.categoria.Categoria;
import com.geekbay.demo.repositories.CategoriaRepository;
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
        return this.categoriaRepository.findAll().stream().map(categoria -> new CategoriaResponseDTO(categoria)).toList();
    }

    public CategoriaResponseDTO getCategoriaById(Integer id){
        return new CategoriaResponseDTO(this.categoriaRepository.findById(id).get());
    }

    // É melhor usar o findByNome ou essa gambiarra que fiz pra filtrar?
    public CategoriaResponseDTO getCategoriaByNome(String nome){
        //return new CategoriaResponseDTO(this.categoriaRepository.findByNome(nome));
        return new CategoriaResponseDTO(
                filtraCategoriaExistentePorNome(nome).get()
                //this.categoriaRepository.findAll().stream().filter(categoria -> categoria.getNome().equalsIgnoreCase(nome)).findFirst().get()
        );
    }

    // POST

    public void addNewCategoria(CategoriaRequestDTO categoriaRequestDTO){
        if(
                filtraCategoriaExistentePorNome(categoriaRequestDTO.nome()).isEmpty()
            //this.categoriaRepository.findAll().stream().filter(categoria -> categoria.getNome().equalsIgnoreCase(categoriaRequestDTO.nome())).findFirst().isEmpty()
        ){
            this.categoriaRepository.save(new Categoria(categoriaRequestDTO));
        }
        else throw new RuntimeException("Categoria já existente");
    }

    // PUT

    public void updateCategoriaById(Integer id, CategoriaRequestDTO categoriaRequestDTO){

        // Falta adicionar um try-catch pra pegar o use-case onde o id é inválido
        Categoria categoriaASerAtualizada = this.categoriaRepository.findById(id).get();

        if(categoriaRequestDTO.nome() !cl= null) categoriaASerAtualizada.setNome(categoriaRequestDTO.nome());
        if(categoriaRequestDTO.descricao() != null) categoriaASerAtualizada.setDescricao(categoriaRequestDTO.descricao());

        
            // E se eu apagar isso aqui, pois não precisa de salvar no banco, né?
        this.categoriaRepository.save(categoriaASerAtualizada);
    }

    // Usar findByNome ou a gambiarra que fiz pra filtrar?
    public void updateCategoriaByNome(String nome, CategoriaRequestDTO categoriaRequestDTO){

        Categoria categoriaUpdate = new Categoria(categoriaRequestDTO);

        //Categoria categoriaASerAtualizada = this.categoriaRepository.findByNome(nome);
        Categoria categoriaASerAtualizada =
                filtraCategoriaExistentePorNome(nome).get();
        //this.categoriaRepository.findAll().stream().filter(categoria -> categoria.getNome().equalsIgnoreCase(nome)).findFirst().get();
        categoriaUpdate.setId(categoriaASerAtualizada.getId());

        if(categoriaRequestDTO.nome() == null) categoriaUpdate.setNome(categoriaASerAtualizada.getNome());
        if(categoriaRequestDTO.descricao() == null) categoriaUpdate.setDescricao(categoriaASerAtualizada.getDescricao());

        this.categoriaRepository.save(categoriaUpdate);
    }

    // DELETE

    public void deleteCategoriaById(Integer id){

        if(this.categoriaRepository.existsById(id)) this.categoriaRepository.deleteById(id);
        else throw new RuntimeException("ID inválido ou categoria inexistente");
    }

    // Usar findByNome ou a gambiarra que fiz pra filtrar?
    public void deleteCategoriaByNome(String nome){

        //Categoria categoriaDelete = this.categoriaRepository.findByNome(nome);
        Optional<Categoria> categoriaDelete =
                filtraCategoriaExistentePorNome(nome);
        //this.categoriaRepository.findAll().stream().filter(categoria -> categoria.getNome().equalsIgnoreCase(nome)).findFirst();
        if(categoriaDelete.isPresent()){
            this.categoriaRepository.delete(categoriaDelete.get());
        }
        else throw new RuntimeException("ID inválido ou categoria inexistente");
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

package com.geekbay.demo.services;

import com.geekbay.demo.dtos.endereco.EnderecoRequestDTO;
import com.geekbay.demo.dtos.endereco.EnderecoResponseDTO;
import com.geekbay.demo.entities.Usuario;
import com.geekbay.demo.entities.endereco.Endereco;
import com.geekbay.demo.exceptions.NotFoundException;
import com.geekbay.demo.repositories.EnderecoRepository;
import com.geekbay.demo.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EnderecoService {
    private final EnderecoRepository enderecoRepository;

    private final UsuarioRepository usuarioRepository;

    public EnderecoService(EnderecoRepository enderecoRepository, UsuarioRepository usuarioRepository) {
        this.enderecoRepository = enderecoRepository;
        this.usuarioRepository = usuarioRepository;
    }


    public EnderecoResponseDTO getEnderecoByCep(String cep) {

        Endereco enderecoBuscadoDB = this.enderecoRepository.findByCep(cep);

        if (enderecoBuscadoDB == null) {
            throw new NotFoundException("Endereço não encontrado para o CEP informado");
        }

        String url = "https://brasilapi.com.br/api/cep/v1/" + cep;

        RestTemplate restTemplate = new RestTemplate();

        Endereco enderecoResposta = restTemplate.getForEntity(url, Endereco.class).getBody();

        enderecoResposta.setUsuario(enderecoBuscadoDB.getUsuario());

        enderecoResposta.setNumber(enderecoBuscadoDB.getNumber());
        enderecoResposta.setComplement(enderecoBuscadoDB.getComplement());

        return new EnderecoResponseDTO(enderecoResposta);
    }


    public EnderecoResponseDTO getEnderecoByUsuarioId(Long usuarioId) {

        Endereco enderecoBuscadoDB = this.enderecoRepository.findByUsuario_Id(usuarioId);

        if (enderecoBuscadoDB == null) {
            throw new NotFoundException("Endereço não encontrado para o usuário informado");
        }

        String url = "https://brasilapi.com.br/api/cep/v1/" + enderecoBuscadoDB.getCep();

        RestTemplate restTemplate = new RestTemplate();

        Endereco enderecoResposta = restTemplate.getForEntity(url, Endereco.class).getBody();

        enderecoResposta.setUsuario(enderecoBuscadoDB.getUsuario());

        enderecoResposta.setNumber(enderecoBuscadoDB.getNumber());
        enderecoResposta.setComplement(enderecoBuscadoDB.getComplement());


        return new EnderecoResponseDTO(enderecoResposta);
    }


    public void addNewEnderecoByCep(EnderecoRequestDTO dto) {
        String url = "https://brasilapi.com.br/api/cep/v1/" + dto.cep();
        RestTemplate restTemplate = new RestTemplate();

        Endereco enderecoApi = restTemplate.getForObject(url, Endereco.class);

        Endereco enderecoAdd = new Endereco(dto);

        enderecoAdd.setState(enderecoApi.getState());
        enderecoAdd.setCity(enderecoApi.getCity());
        enderecoAdd.setNeighborhood(enderecoApi.getNeighborhood());
        enderecoAdd.setStreet(enderecoApi.getStreet());
        enderecoAdd.setService(enderecoApi.getService());

        Usuario usuario = this.usuarioRepository.findById(dto.usuarioId())
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        enderecoAdd.setUsuario(usuario);

        this.enderecoRepository.save(enderecoAdd);
    }
}
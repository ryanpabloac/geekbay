package com.geekbay.demo.services;

import com.geekbay.demo.dtos.endereco.EnderecoRequestDTO;
import com.geekbay.demo.dtos.endereco.EnderecoResponseDTO;
import com.geekbay.demo.entities.endereco.Endereco;
import com.geekbay.demo.repositories.EnderecoRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EnderecoService {
    private final EnderecoRepository enderecoRepository;

    public EnderecoService(EnderecoRepository enderecoRepository){
        this.enderecoRepository = enderecoRepository;
    }


    public EnderecoResponseDTO getEnderecoByCep(String cep){
        String url = "https://brasilapi.com.br/api/cep/v1/" + cep;

        RestTemplate restTemplate = new RestTemplate();
        //Object endereco = restTemplate.getForObject(url, Object.class);
        //System.out.println(endereco.toString());

        //String stringEndereco = endereco.toString();

        //ResponseEntity<Endereco> enderecoEntity = restTemplate.getForEntity(url, Endereco.class);
        Endereco enderecoResposta = restTemplate.getForEntity(url, Endereco.class).getBody();

        enderecoResposta.setUsuarioId(this.enderecoRepository.findByCep(cep).getUsuarioId());

        EnderecoResponseDTO enderecoResponseDTO = new EnderecoResponseDTO(enderecoResposta);

        return enderecoResponseDTO;
        //return restTemplate.getForObject(url, Object.class);
    }

    public EnderecoResponseDTO getEnderecoByUsuarioId(Integer usuarioId){
        Endereco enderecoBuscadoDB = this.enderecoRepository.findByUsuarioId(usuarioId);

        String url = "https://brasilapi.com.br/api/cep/v1/" + enderecoBuscadoDB.getCep();

        RestTemplate restTemplate = new RestTemplate();

        Endereco enderecoResposta = restTemplate.getForEntity(url, Endereco.class).getBody();
        enderecoResposta.setUsuarioId(enderecoBuscadoDB.getUsuarioId());

        return new EnderecoResponseDTO(enderecoResposta);
    }


    public void addNewEnderecoByCep(EnderecoRequestDTO enderecoRequestDTO){
        Endereco enderecoAdd = new Endereco(enderecoRequestDTO);
        this.enderecoRepository.save(enderecoAdd);
    }
}

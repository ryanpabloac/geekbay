package com.geekbay.demo.dtos.endereco;

import com.geekbay.demo.entities.endereco.Endereco;

public record EnderecoResponseDTO(
        String cep,
        String state,
        String city,
        String neighborhood,
        String street,
        String service,
        Integer usuarioId
) {
    public EnderecoResponseDTO(Endereco endereco){
        this(endereco.getCep(), endereco.getState(), endereco.getCity(), endereco.getNeighborhood(), endereco.getStreet(), endereco.getService(), endereco.getUsuarioId());
    }
}

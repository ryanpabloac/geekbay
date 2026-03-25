package com.geekbay.demo.entities.endereco;

import com.geekbay.demo.dtos.endereco.EnderecoRequestDTO;
import com.geekbay.demo.entities.Usuario;
import jakarta.persistence.*;

@Entity(name = "endereco")
@Table(name = "endereco")
public class Endereco {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "endereco_seq")
    @SequenceGenerator(name = "endereco_seq", sequenceName = "endereco_seq", initialValue = 1, allocationSize = 1)
    private Integer id;
    @Column(nullable = false)
    private String cep;

    private String state;
    private String city;
    private String neighborhood;
    private String street;
    private String service;
    private String number;
    private String complement;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    public Endereco(){}

    public Endereco(String cep, String state, String city, String neighborhood,
                    String street, String service, String number,
                    String complement, Usuario usuario) {
        this.cep = cep;
        this.state = state;
        this.city = city;
        this.neighborhood = neighborhood;
        this.street = street;
        this.service = service;
        this.number = number;
        this.complement = complement;
        this.usuario = usuario;
    }

    public Endereco(EnderecoRequestDTO enderecoRequestDTO){
        this.cep = enderecoRequestDTO.cep();
        this.number = enderecoRequestDTO.number();
        this.complement = enderecoRequestDTO.complement();

    }


    public String getCep() {return cep;}
    public void setCep(String cep) {this.cep = cep;}

    public String getState() {return state;}
    public void setState(String state) {this.state = state;}

    public String getCity() {return city;}
    public void setCity(String city) {this.city = city;}

    public String getNeighborhood() {return neighborhood;}
    public void setNeighborhood(String neighborhood) {this.neighborhood = neighborhood;}

    public String getStreet() {return street;}
    public void setStreet(String street) {this.street = street;}

    public String getService() {return service;}
    public void setService(String service) {this.service = service;}

    public Integer getId() {return id;}

    public void setId(Integer id) {this.id = id;}

    public String getNumber() {return number;}

    public void setNumber(String number) {this.number = number;}

    public String getComplement() {return complement;}

    public void setComplement(String complement) {this.complement = complement;}

    public Usuario getUsuario() {return usuario;}

    public void setUsuario(Usuario usuario) {this.usuario = usuario;}
}

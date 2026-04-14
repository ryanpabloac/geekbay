package com.geekbay.demo.entities.usuario;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.geekbay.demo.dtos.usuario.UsuarioResponseDTO;
import com.geekbay.demo.entities.endereco.Endereco;
import com.geekbay.demo.entities.pedido.Pedido;
import com.geekbay.demo.enums.Profile;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Table(name = "usuario")
public class Usuario implements Serializable {

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String cpf;

    @Column(unique = true, nullable = false)
    private String email;

    private String telefone;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Profile perfil;

    @JsonIgnore
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Endereco> enderecos = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Pedido> pedidos = new ArrayList<>();

    public Usuario(UsuarioResponseDTO usuarioResponseDTO){
        this.nome = usuarioResponseDTO.nome();
        this.cpf = usuarioResponseDTO.cpf();
        this.email = usuarioResponseDTO.email();
        this.telefone = usuarioResponseDTO.telefone();
    }

}
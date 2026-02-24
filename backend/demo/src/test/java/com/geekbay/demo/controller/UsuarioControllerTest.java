package com.geekbay.demo.controller;

import com.geekbay.demo.entities.Usuario;
import com.geekbay.demo.enums.Profile;
import com.geekbay.demo.services.UsuarioService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = UsuarioController.class)
class UsuarioControllerTest {

    @MockitoBean
    private UsuarioService usuarioService;

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("POST /usuarios deve retornar 201 e o UsuarioResponseDTO quando request é válido")
    void createUser_whenValidRequest_returns201AndBody() throws Exception {
        String jsonBody = """
                {
                  "name": "Cliente Silveira",
                  "cpf": "12345678900",
                  "email": "admin@email.com",
                  "phone": "34999999999",
                  "password": "123456",
                  "profile": "CLIENTE"
                }
                """;

        Usuario usuarioRetornado = Usuario.builder()
                .id(1L)
                .name("Cliente Silveira")
                .cpf("12345678900")
                .email("cliente@email.com")
                .phone("34999999999")
                .password("123456")
                .profile(Profile.CLIENTE)
                .build();

        when(usuarioService.createUser(any(Usuario.class))).thenReturn(usuarioRetornado);

        mockMvc.perform(post("/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonBody))
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Cliente Silveira"))
                .andExpect(jsonPath("$.cpf").value("12345678900"))
                .andExpect(jsonPath("$.email").value("cliente@email.com"))
                .andExpect(jsonPath("$.phone").value("34999999999"))
                .andExpect(jsonPath("$.profile").value("CLIENTE"));

        verify(usuarioService, times(1)).createUser(any(Usuario.class));
    }

    @Test
    @DisplayName("POST /usuarios deve forçar Profile.CLIENTE ao chamar o service (ignora profile do DTO)")
    void createUser_shouldForceClienteProfile() throws Exception {
        String jsonBody = """
                {
                  "name": "Teste",
                  "cpf": "98765432100",
                  "email": "teste@email.com",
                  "phone": "34988887777",
                  "password": "senha",
                  "profile": "ADMIN"
                }
                """;

        Usuario usuarioRetornado = Usuario.builder()
                .id(10L)
                .name("Teste")
                .cpf("98765432100")
                .email("teste@email.com")
                .phone("34988887777")
                .password("senha")
                .profile(Profile.CLIENTE)
                .build();

        when(usuarioService.createUser(any(Usuario.class))).thenReturn(usuarioRetornado);

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);

        mockMvc.perform(post("/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonBody))
                .andExpect(status().isCreated());

        verify(usuarioService).createUser(captor.capture());
        Usuario enviado = captor.getValue();

        assertThat(enviado.getProfile()).isEqualTo(Profile.CLIENTE);
        assertThat(enviado.getEmail()).isEqualTo("teste@email.com");
        assertThat(enviado.getCpf()).isEqualTo("98765432100");
    }

    @Test
    @DisplayName("POST /usuarios deve retornar 400 quando faltar campos obrigatórios (@NotBlank)")
    void createUser_whenMissingRequiredFields_returns400() throws Exception {
        String jsonBody = """
                {
                  "name": "",
                  "email": "ok@email.com",
                  "phone": "34999999999",
                  "password": "123456",
                  "profile": "CLIENTE"
                }
                """;

        mockMvc.perform(post("/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonBody))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(usuarioService);
    }

    @Test
    @DisplayName("POST /usuarios deve retornar 400 quando email for inválido (@Email)")
    void createUser_whenInvalidEmail_returns400() throws Exception {
        String jsonBody = """
                {
                  "name": "Teste",
                  "cpf": "12345678900",
                  "email": "email_invalido",
                  "phone": "34999999999",
                  "password": "123456",
                  "profile": "CLIENTE"
                }
                """;

        mockMvc.perform(post("/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonBody))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(usuarioService);
    }
}
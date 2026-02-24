package com.geekbay.demo.services;

import com.geekbay.demo.entities.Usuario;
import com.geekbay.demo.exceptions.AlreadyExistsException;
import com.geekbay.demo.repositories.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository userRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    void createUser_whenCpfAndEmailNotExists_shouldSaveAndReturnUser() {
        Usuario usuario = mock(Usuario.class);
        when(usuario.getCpf()).thenReturn("12345678900");
        when(usuario.getEmail()).thenReturn("ruty@email.com");

        when(userRepository.existsByCpf("12345678900")).thenReturn(false);
        when(userRepository.existsByEmail("ruty@email.com")).thenReturn(false);

        Usuario saved = mock(Usuario.class);
        when(userRepository.save(usuario)).thenReturn(saved);

        Usuario result = usuarioService.createUser(usuario);

        assertNotNull(result);
        assertSame(saved, result);

        verify(userRepository).existsByCpf("12345678900");
        verify(userRepository).existsByEmail("ruty@email.com");

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(userRepository).save(captor.capture());
        assertSame(usuario, captor.getValue());

        verifyNoMoreInteractions(userRepository);
    }

    @Test
    void createUser_whenCpfAlreadyExists_shouldThrowAlreadyExistsException_andNotSave() {
        Usuario usuario = mock(Usuario.class);
        when(usuario.getCpf()).thenReturn("345534324323");

        when(userRepository.existsByCpf("345534324323")).thenReturn(true);

        AlreadyExistsException ex = assertThrows(
                AlreadyExistsException.class,
                () -> usuarioService.createUser(usuario)
        );

        assertEquals("CPF 345534324323 já cadastrado.", ex.getMessage());

        verify(userRepository).existsByCpf("345534324323");
        verify(userRepository, never()).existsByEmail(anyString());
        verify(userRepository, never()).save(any(Usuario.class));

        verifyNoMoreInteractions(userRepository);
    }

    @Test
    void createUser_whenEmailAlreadyExists_shouldThrowAlreadyExistsException_andNotSave() {
        Usuario usuario = mock(Usuario.class);
        when(usuario.getCpf()).thenReturn("12345678900");
        when(usuario.getEmail()).thenReturn("jaexiste@email.com");

        when(userRepository.existsByCpf("12345678900")).thenReturn(false);
        when(userRepository.existsByEmail("jaexiste@email.com")).thenReturn(true);

        AlreadyExistsException ex = assertThrows(
                AlreadyExistsException.class,
                () -> usuarioService.createUser(usuario)
        );

        assertEquals("E-mail jaexiste@email.com já cadastrado.", ex.getMessage());

        verify(userRepository).existsByCpf("12345678900");
        verify(userRepository).existsByEmail("jaexiste@email.com");
        verify(userRepository, never()).save(any(Usuario.class));

        verifyNoMoreInteractions(userRepository);
    }
}